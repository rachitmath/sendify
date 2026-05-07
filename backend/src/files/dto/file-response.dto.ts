import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FileResponseDto {
  @Expose()
  id: string;

  @Expose()
  shareId: string;

  @Expose()
  originalName: string;

  @Expose()
  fileSize: number;

  @Expose()
  mimeType: string;

  @Expose()
  passwordEnabled: boolean;

  @Expose()
  expiresAt: Date;

  @Expose()
  maxDownloads: number;

  @Expose()
  downloadCount: number;

  @Expose()
  createdAt: Date;
}

@Exclude()
export class FileDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  shareId: string;

  @Expose()
  originalName: string;

  @Expose()
  fileName: string;

  @Expose()
  fileSize: number;

  @Expose()
  mimeType: string;

  @Expose()
  passwordEnabled: boolean;

  @Expose()
  expiresAt: Date;

  @Expose()
  maxDownloads: number;

  @Expose()
  downloadCount: number;

  @Expose()
  notifyEmails: string[];

  @Expose()
  createdAt: Date;
}
