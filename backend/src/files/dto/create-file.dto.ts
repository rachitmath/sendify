import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEmail, Min, Max, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateFileDto {
  @IsString()
  originalName: string;

  @IsString()
  fileName: string;

  @IsNumber()
  @Type(() => Number)
  fileSize: number;

  @IsString()
  mimeType: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  passwordEnabled?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-1)
  maxDownloads?: number;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map((s: string) => s.trim()) : value))
  notifyEmails?: string[];
}
