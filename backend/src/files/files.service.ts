import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { File, FileDocument } from './schemas/file.schema';
import { Upload, UploadDocument } from './schemas/upload.schema';
import { CreateFileDto } from './dto/create-file.dto';
import { StorageService } from '../storage/storage.service';
import { ConfigService } from '../config/config.service';

const generateShareId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', 8);

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly saltRounds = 12;
  private readonly defaultExpiryHours: number;

  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    this.defaultExpiryHours = this.configService.getNumber('UPLOAD_EXPIRY_HOURS') || 24;
  }

  async createFile(dto: CreateFileDto, userId?: string): Promise<FileDocument> {
    const shareId = generateShareId();
    
    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    }

    const expiresAt = dto.expiresAt 
      ? new Date(dto.expiresAt) 
      : new Date(Date.now() + this.defaultExpiryHours * 60 * 60 * 1000);

    const file = new this.fileModel({
      shareId,
      originalName: dto.originalName,
      fileName: dto.fileName,
      fileSize: dto.fileSize,
      mimeType: dto.mimeType,
      password: passwordHash,
      passwordEnabled: dto.passwordEnabled || !!dto.password,
      expiresAt,
      maxDownloads: dto.maxDownloads ?? -1,
      downloadCount: 0,
      notifyEmails: dto.notifyEmails || [],
      uploadedBy: userId,
    });

    await file.save();
    this.logger.log(`File created with shareId: ${shareId}`);
    
    return file;
  }

  async findByShareId(shareId: string): Promise<FileDocument | null> {
    return this.fileModel.findOne({ shareId, deletedAt: { $exists: false } }).exec();
  }

  async findByShareIdOrFail(shareId: string): Promise<FileDocument> {
    const file = await this.findByShareId(shareId);
    if (!file) {
      throw new NotFoundException('File not found or has expired');
    }
    return file;
  }

  async verifyPassword(shareId: string, password: string): Promise<{
    valid: boolean;
    attemptsRemaining?: number;
  }> {
    const file = await this.findByShareIdOrFail(shareId);
    
    if (!file.passwordEnabled || !file.password) {
      return { valid: true };
    }

    const isValid = await bcrypt.compare(password, file.password);
    
    if (!isValid) {
      this.logger.warn(`Invalid password attempt for shareId: ${shareId}`);
    }

    return { valid: isValid };
  }

  async incrementDownloadCount(shareId: string): Promise<void> {
    await this.fileModel.updateOne(
      { shareId },
      { $inc: { downloadCount: 1 } },
    ).exec();
  }

  async isDownloadAllowed(shareId: string): Promise<boolean> {
    const file = await this.findByShareIdOrFail(shareId);
    
    if (file.maxDownloads > 0 && file.downloadCount >= file.maxDownloads) {
      throw new BadRequestException('Download limit reached');
    }

    if (new Date() > file.expiresAt) {
      throw new BadRequestException('This file has expired');
    }

    return true;
  }

  async getFilesByUserId(userId: string): Promise<FileDocument[]> {
    return this.fileModel
      .find({ uploadedBy: userId, deletedAt: { $exists: false } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteFile(shareId: string): Promise<void> {
    const file = await this.findByShareIdOrFail(shareId);
    
    try {
      await this.storageService.deleteFile(file.fileName);
    } catch (error) {
      this.logger.warn(`Failed to delete file from storage: ${file.fileName}`, error);
    }

    await this.fileModel.updateOne(
      { _id: file._id },
      { $set: { deletedAt: new Date() } },
    ).exec();

    this.logger.log(`File deleted: ${shareId}`);
  }

  async cleanupExpiredFiles(): Promise<number> {
    const expiredFiles = await this.fileModel
      .find({ expiresAt: { $lt: new Date() }, deletedAt: { $exists: false } })
      .exec();

    let deletedCount = 0;

    for (const file of expiredFiles) {
      try {
        await this.storageService.deleteFile(file.fileName);
      } catch (error) {
        this.logger.warn(`Failed to delete expired file from storage: ${file.fileName}`);
      }

      await this.fileModel.updateOne(
        { _id: file._id },
        { $set: { deletedAt: new Date() } },
      ).exec();

      deletedCount++;
    }

    if (deletedCount > 0) {
      this.logger.log(`Cleaned up ${deletedCount} expired files`);
    }

    return deletedCount;
  }

  async cleanupIncompleteUploads(): Promise<number> {
    const incompleteUploads = await this.uploadModel
      .find({
        expiresAt: { $lt: new Date() },
        status: { $in: ['pending', 'uploading'] },
      })
      .exec();

    let deletedCount = 0;

    for (const upload of incompleteUploads) {
      if (upload.multipartUploadId) {
        try {
          await this.storageService.abortMultipartUpload(
            upload.fileName,
            upload.multipartUploadId,
          );
        } catch (error) {
          this.logger.warn(`Failed to abort multipart upload: ${upload.uploadId}`);
        }
      }

      await this.uploadModel.deleteOne({ _id: upload._id }).exec();
      deletedCount++;
    }

    if (deletedCount > 0) {
      this.logger.log(`Cleaned up ${deletedCount} incomplete uploads`);
    }

    return deletedCount;
  }

  async getUploadStatus(uploadId: string): Promise<{
    status: string;
    chunksReceived: number;
    totalChunks: number;
  } | null> {
    const upload = await this.uploadModel.findOne({ uploadId }).exec();
    
    if (!upload) {
      return null;
    }

    return {
      status: upload.status,
      chunksReceived: upload.chunksReceived.length,
      totalChunks: upload.totalChunks,
    };
  }
}
