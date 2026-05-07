import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShareFileDto {
  @ApiPropertyOptional({ description: 'Password to protect the file', minLength: 4 })
  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password?: string;

  @ApiPropertyOptional({ description: 'Expiration date ISO string' })
  @IsOptional()
  @IsString()
  expiresAt?: string;

  @ApiPropertyOptional({ description: 'Maximum number of downloads' })
  @IsOptional()
  @IsString()
  maxDownloads?: string;

  @ApiPropertyOptional({ description: 'Comma-separated email addresses' })
  @IsOptional()
  @IsString()
  notifyEmails?: string;
}

export class VerifyPasswordDto {
  @ApiProperty({ description: 'Password to verify', minLength: 1 })
  @IsString()
  password: string;
}
