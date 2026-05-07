import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { Readable } from 'stream';
import { Upload, UploadDocument, UploadStatus } from '../files/schemas/upload.schema';
import { StorageService } from '../storage/storage.service';
import { FilesService } from '../files/files.service';
import { ConfigService } from '../config/config.service';
import { InitiateUploadDto, CompleteUploadDto } from './dto/upload.dto';

const generateUploadId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 32);

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly defaultChunkSize: number;
  private readonly maxFileSize: number;

  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    private readonly storageService: StorageService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {
    this.defaultChunkSize = this.configService.getNumber('CHUNK_SIZE') || 5 * 1024 * 1024;
    this.maxFileSize = this.configService.getNumber('MAX_FILE_SIZE') || 5 * 1024 * 1024 * 1024;
  }

  async initiateUpload(dto: InitiateUploadDto): Promise<{
    uploadId: string;
    chunkSize: number;
    totalChunks: number;
    expiresAt: Date;
  }> {
    if (dto.fileSize > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / (1024 * 1024 * 1024)}GB`,
      );
    }

    const chunkSize = dto.chunkSize || this.defaultChunkSize;
    const totalChunks = Math.ceil(dto.fileSize / chunkSize);

    const uploadId = generateUploadId();
    const fileName = `uploads/${uploadId}/${dto.fileName}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const multipartUploadId = await this.storageService.initiateMultipartUpload(
      fileName,
      dto.mimeType,
    );

    const upload = new this.uploadModel({
      uploadId,
      fileName,
      originalName: dto.fileName,
      fileSize: dto.fileSize,
      mimeType: dto.mimeType,
      chunkSize,
      totalChunks,
      chunksReceived: [],
      uploadedParts: [],
      status: UploadStatus.UPLOADING,
      multipartUploadId,
      expiresAt,
    });

    await upload.save();

    this.logger.log(`Upload initiated: ${uploadId} (${totalChunks} chunks)`);

    return {
      uploadId,
      chunkSize,
      totalChunks,
      expiresAt,
    };
  }

  async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunk: Buffer,
  ): Promise<{
    chunkIndex: number;
    received: boolean;
    totalReceived: number;
    totalChunks: number;
  }> {
    const upload = await this.uploadModel.findOne({ uploadId }).exec();

    if (!upload) {
      throw new BadRequestException('Upload not found');
    }

    if (upload.status === UploadStatus.COMPLETED) {
      throw new BadRequestException('Upload already completed');
    }

    if (chunkIndex < 0 || chunkIndex >= upload.totalChunks) {
      throw new BadRequestException('Invalid chunk index');
    }

    if (upload.chunksReceived.includes(chunkIndex)) {
      return {
        chunkIndex,
        received: true,
        totalReceived: upload.chunksReceived.length,
        totalChunks: upload.totalChunks,
      };
    }

    const partNumber = chunkIndex + 1;
    const etag = await this.storageService.uploadPart(
      upload.fileName,
      upload.multipartUploadId!,
      partNumber,
      chunk,
    );

    upload.chunksReceived.push(chunkIndex);
    upload.uploadedParts.push(etag);
    await upload.save();

    this.logger.debug(
      `Chunk ${chunkIndex + 1}/${upload.totalChunks} received for upload ${uploadId}`,
    );

    return {
      chunkIndex,
      received: true,
      totalReceived: upload.chunksReceived.length,
      totalChunks: upload.totalChunks,
    };
  }

  async completeUpload(
    uploadId: string,
    dto: CompleteUploadDto,
  ): Promise<{
    fileId: string;
    shareId: string;
    downloadUrl: string;
  }> {
    const upload = await this.uploadModel.findOne({ uploadId }).exec();

    if (!upload) {
      throw new BadRequestException('Upload not found');
    }

    if (upload.status === UploadStatus.COMPLETED) {
      throw new BadRequestException('Upload already completed');
    }

    if (upload.chunksReceived.length !== upload.totalChunks) {
      throw new BadRequestException(
        `Upload incomplete. Received ${upload.chunksReceived.length} of ${upload.totalChunks} chunks`,
      );
    }

    const parts = upload.uploadedParts.map((etag, index) => ({
      ETag: etag,
      PartNumber: index + 1,
    }));

    await this.storageService.completeMultipartUpload(
      upload.fileName,
      upload.multipartUploadId!,
      parts,
    );

    upload.status = UploadStatus.COMPLETED;
    await upload.save();

    const file = await this.filesService.createFile({
      originalName: dto.fileName,
      fileName: upload.fileName,
      fileSize: upload.fileSize,
      mimeType: dto.mimeType,
      password: dto.password,
      passwordEnabled: !!dto.password,
      expiresAt: dto.expiresAt,
      maxDownloads: dto.maxDownloads,
      notifyEmails: dto.notifyEmails ? dto.notifyEmails.split(',').map((e) => e.trim()) : undefined,
    });

    const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/download/${file.shareId}`;

    this.logger.log(`Upload completed: ${uploadId} -> ${file.shareId}`);

    return {
      fileId: file._id.toString(),
      shareId: file.shareId,
      downloadUrl,
    };
  }

  async getUploadStatus(uploadId: string): Promise<{
    status: string;
    chunksReceived: number;
    totalChunks: number;
  } | null> {
    return this.filesService.getUploadStatus(uploadId);
  }

  async cancelUpload(uploadId: string): Promise<void> {
    const upload = await this.uploadModel.findOne({ uploadId }).exec();

    if (!upload) {
      return;
    }

    if (upload.multipartUploadId) {
      await this.storageService.abortMultipartUpload(
        upload.fileName,
        upload.multipartUploadId,
      );
    }

    await this.uploadModel.deleteOne({ uploadId }).exec();
    this.logger.log(`Upload cancelled: ${uploadId}`);
  }
}
