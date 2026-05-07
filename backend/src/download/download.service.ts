import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { FilesService } from '../files/files.service';
import { StorageService } from '../storage/storage.service';
import archiver from 'archiver';
import { Writable } from 'stream';

@Injectable()
export class DownloadService {
  private readonly logger = new Logger(DownloadService.name);

  constructor(
    private readonly filesService: FilesService,
    private readonly storageService: StorageService,
  ) {}

  async getFileStream(shareId: string): Promise<{
    stream: Readable;
    fileName: string;
    mimeType: string;
    fileSize: number;
  }> {
    const file = await this.filesService.findByShareIdOrFail(shareId);

    await this.filesService.isDownloadAllowed(shareId);

    const fileStream = await this.storageService.getFile(file.fileName);
    const metadata = await this.storageService.getFileMetadata(file.fileName);

    await this.filesService.incrementDownloadCount(shareId);

    return {
      stream: fileStream,
      fileName: file.originalName,
      mimeType: metadata.contentType,
      fileSize: metadata.contentLength,
    };
  }

  async getZipStream(shareId: string): Promise<{
    stream: Readable;
    fileName: string;
    mimeType: string;
    fileSize: number;
  }> {
    const file = await this.filesService.findByShareIdOrFail(shareId);

    await this.filesService.isDownloadAllowed(shareId);

    const fileStream = await this.storageService.getFile(file.fileName);
    const metadata = await this.storageService.getFileMetadata(file.fileName);

    await this.filesService.incrementDownloadCount(shareId);

    const archive = archiver('zip', {
      zlib: { level: 5 },
    });

    archive.append(fileStream, { name: file.originalName });

    const chunks: Buffer[] = [];
    const writable = new Writable({
      write(chunk: Buffer, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    archive.pipe(writable);

    await new Promise<void>((resolve, reject) => {
      writable.on('finish', resolve);
      writable.on('error', reject);
      archive.on('error', reject);
      archive.finalize();
    });

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const zipStream = Readable.from(chunks);

    return {
      stream: zipStream,
      fileName: `${file.originalName.split('.')[0]}.zip`,
      mimeType: 'application/zip',
      fileSize: totalSize,
    };
  }

  async getDownloadInfo(shareId: string): Promise<{
    fileCount: number;
    totalSize: number;
    expiresAt: Date;
    passwordEnabled: boolean;
    originalName: string;
    mimeType: string;
  }> {
    const file = await this.filesService.findByShareIdOrFail(shareId);

    return {
      fileCount: 1,
      totalSize: file.fileSize,
      expiresAt: file.expiresAt,
      passwordEnabled: file.passwordEnabled,
      originalName: file.originalName,
      mimeType: file.mimeType,
    };
  }

  async getSignedDownloadUrl(shareId: string): Promise<string> {
    const file = await this.filesService.findByShareIdOrFail(shareId);
    await this.filesService.isDownloadAllowed(shareId);
    
    return this.storageService.getSignedDownloadUrl(file.fileName);
  }
}
