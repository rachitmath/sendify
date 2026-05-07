import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiateUploadDto {
  @ApiProperty({ description: 'Original file name', example: 'document.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'File size in bytes', example: 1048576 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  fileSize: number;

  @ApiProperty({ description: 'MIME type of the file', example: 'application/pdf' })
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ description: 'Chunk size in bytes for large files', example: 5242880 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  chunkSize?: number;
}

export class CompleteUploadDto {
  @ApiProperty({ description: 'Original file name', example: 'document.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'MIME type of the file', example: 'application/pdf' })
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ description: 'Password to protect the file', minLength: 4 })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: 'Expiration date ISO string', example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsString()
  expiresAt?: string;

  @ApiPropertyOptional({ description: 'Maximum number of downloads (-1 for unlimited)', example: 10 })
  @IsOptional()
  @IsNumber()
  maxDownloads?: number;

  @ApiPropertyOptional({ description: 'Comma-separated email addresses for notifications' })
  @IsOptional()
  @IsString()
  notifyEmails?: string;
}
