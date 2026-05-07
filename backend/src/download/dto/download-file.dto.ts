import { IsString, IsOptional } from 'class-validator';

export class DownloadFileDto {
  @IsOptional()
  @IsString()
  password?: string;
}

export class DownloadInfoDto {
  shareId: string;
  fileCount: number;
  totalSize: number;
  expiresAt: Date;
  passwordEnabled: boolean;
}
