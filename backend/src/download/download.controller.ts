import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DownloadService } from './download.service';
import { ThrottlerBehindProxyGuard } from '../common/guards/throttler-behind-proxy.guard';

@ApiTags('download')
@Controller('download')
@UseGuards(ThrottlerBehindProxyGuard)
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get(':shareId')
  @ApiOperation({ summary: 'Download file' })
  @ApiParam({ name: 'shareId', description: 'Unique share identifier' })
  @ApiResponse({ status: 200, description: 'File stream' })
  @ApiResponse({ status: 404, description: 'File not found or expired' })
  async downloadFile(
    @Param('shareId') shareId: string,
    @Res() res: Response,
  ) {
    const { stream, fileName, mimeType, fileSize } = await this.downloadService.getFileStream(shareId);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Length', fileSize);

    stream.pipe(res);
  }

  @Get(':shareId/info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get download information' })
  @ApiParam({ name: 'shareId', description: 'Unique share identifier' })
  @ApiResponse({ status: 200, description: 'Download information' })
  async getDownloadInfo(@Param('shareId') shareId: string) {
    return this.downloadService.getDownloadInfo(shareId);
  }

  @Get(':shareId/signed')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get pre-signed download URL' })
  @ApiParam({ name: 'shareId', description: 'Unique share identifier' })
  @ApiResponse({ status: 200, description: 'Pre-signed URL for direct download' })
  async getSignedUrl(@Param('shareId') shareId: string) {
    const url = await this.downloadService.getSignedDownloadUrl(shareId);
    return { url };
  }
}
