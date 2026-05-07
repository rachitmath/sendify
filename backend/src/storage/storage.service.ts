import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '../config/config.service';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly multipartChunkSize = 5 * 1024 * 1024;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID') || 'minioadmin';
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY') || 'minioadmin';
    const region = this.configService.get('AWS_REGION') || 'us-east-1';
    const endpoint = this.configService.get('AWS_S3_ENDPOINT') || 'http://localhost:9000';
    this.bucket = this.configService.get('AWS_S3_BUCKET') || 'fileshare-uploads';

    this.logger.log(`Storage configured: ${this.bucket} in ${region}`);

    this.s3Client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    key: string,
    body: Buffer | Readable,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
      });

      await this.s3Client.send(command);
      this.logger.debug(`File uploaded: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to upload file ${key}:`, error);
      throw error;
    }
  }

  async getFile(key: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return response.Body as Readable;
    } catch (error) {
      this.logger.error(`Failed to get file ${key}:`, error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.debug(`File deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}:`, error);
      throw error;
    }
  }

  async getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return url;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for ${key}:`, error);
      throw error;
    }
  }

  async initiateMultipartUpload(key: string, contentType: string): Promise<string> {
    try {
      const command = new CreateMultipartUploadCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      });

      const response = await this.s3Client.send(command);
      return response.UploadId!;
    } catch (error) {
      this.logger.error(`Failed to initiate multipart upload for ${key}:`, error);
      throw error;
    }
  }

  async uploadPart(
    key: string,
    uploadId: string,
    partNumber: number,
    body: Buffer,
  ): Promise<string> {
    try {
      const command = new UploadPartCommand({
        Bucket: this.bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: body,
      });

      const response = await this.s3Client.send(command);
      return response.ETag!;
    } catch (error) {
      this.logger.error(`Failed to upload part ${partNumber} for ${key}:`, error);
      throw error;
    }
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ): Promise<void> {
    try {
      const command = new CompleteMultipartUploadCommand({
        Bucket: this.bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
        },
      });

      await this.s3Client.send(command);
      this.logger.debug(`Multipart upload completed: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to complete multipart upload for ${key}:`, error);
      throw error;
    }
  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    try {
      const command = new AbortMultipartUploadCommand({
        Bucket: this.bucket,
        Key: key,
        UploadId: uploadId,
      });

      await this.s3Client.send(command);
      this.logger.debug(`Multipart upload aborted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to abort multipart upload for ${key}:`, error);
      throw error;
    }
  }

  async getFileMetadata(key: string): Promise<{
    contentLength: number;
    contentType: string;
    lastModified: Date;
  }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return {
        contentLength: response.ContentLength || 0,
        contentType: response.ContentType || 'application/octet-stream',
        lastModified: response.LastModified || new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to get metadata for ${key}:`, error);
      throw error;
    }
  }

  getMultipartChunkSize(): number {
    return this.multipartChunkSize;
  }
}
