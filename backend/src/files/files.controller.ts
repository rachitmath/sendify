import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { VerifyPasswordDto } from './dto/share-file.dto';
import { ThrottlerBehindProxyGuard } from '../common/guards/throttler-behind-proxy.guard';

@ApiTags('files')
@Controller('files')
@UseGuards(ThrottlerBehindProxyGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':shareId')
  @ApiOperation({ summary: 'Get file information' })
  @ApiParam({ name: 'shareId', description: 'Unique share identifier' })
  @ApiResponse({ status: 200, description: 'File information retrieved' })
  @ApiResponse({ status: 404, description: 'File not found or expired' })
  async getFileInfo(@Param('shareId') shareId: string) {
    const file = await this.filesService.findByShareIdOrFail(shareId);
    
    return {
      shareId: file.shareId,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      passwordEnabled: file.passwordEnabled,
      expiresAt: file.expiresAt,
      maxDownloads: file.maxDownloads,
      downloadCount: file.downloadCount,
      createdAt: file.createdAt,
    };
  }

  @Post(':shareId/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @ApiOperation({ summary: 'Verify file password' })
  @ApiParam({ name: 'shareId', description: 'Unique share identifier' })
  @ApiResponse({ status: 200, description: 'Password verification result' })
  async verifyPassword(
    @Param('shareId') shareId: string,
    @Body() dto: VerifyPasswordDto,
  ) {
    const result = await this.filesService.verifyPassword(shareId, dto.password);
    
    if (!result.valid) {
      return {
        valid: false,
        message: 'Incorrect password',
      };
    }

    return {
      valid: true,
      message: 'Password verified',
    };
  }
}
