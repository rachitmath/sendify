import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FilesService } from '../files/files.service';
import { StorageService } from '../storage/storage.service';
import { ConfigService } from '../config/config.service';
import { InitiateUploadDto, CompleteUploadDto } from './dto/upload.dto';
import { ThrottlerBehindProxyGuard } from '../common/guards/throttler-behind-proxy.guard';

@ApiTags('upload')
@Controller('upload')
@UseGuards(ThrottlerBehindProxyGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly filesService: FilesService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate a chunked upload session' })
  @ApiResponse({ status: 200, description: 'Upload session created' })
  async initiateUpload(@Body() dto: InitiateUploadDto) {
    return this.uploadService.initiateUpload(dto);
  }

  @Post('chunk/:uploadId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('chunk'))
  @ApiOperation({ summary: 'Upload a single chunk' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chunk: { type: 'string', format: 'binary' },
        chunkIndex: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Chunk uploaded successfully' })
  async uploadChunk(
    @Param('uploadId') uploadId: string,
    @Body('chunkIndex') chunkIndexStr: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Chunk file is required');
    }

    const chunkIndex = parseInt(chunkIndexStr, 10);
    if (isNaN(chunkIndex)) {
      throw new BadRequestException('Invalid chunk index');
    }

    return this.uploadService.uploadChunk(uploadId, chunkIndex, file.buffer);
  }

  @Post('complete/:uploadId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete the upload and create share link' })
  @ApiResponse({ status: 200, description: 'File uploaded and share link created' })
  async completeUpload(
    @Param('uploadId') uploadId: string,
    @Body() dto: CompleteUploadDto,
  ) {
    return this.uploadService.completeUpload(uploadId, dto);
  }

  @Get('status/:uploadId')
  @ApiOperation({ summary: 'Get upload status' })
  @ApiResponse({ status: 200, description: 'Current upload status' })
  async getUploadStatus(@Param('uploadId') uploadId: string) {
    const status = await this.uploadService.getUploadStatus(uploadId);
    if (!status) {
      throw new BadRequestException('Upload not found');
    }
    return status;
  }

  @Post('cancel/:uploadId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an upload' })
  @ApiResponse({ status: 200, description: 'Upload cancelled' })
  async cancelUpload(@Param('uploadId') uploadId: string) {
    await this.uploadService.cancelUpload(uploadId);
    return { success: true };
  }

  @Post('simple')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Simple single-file upload (for small files)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  async simpleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: { password?: string; expiresAt?: string },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const uploadId = `simple-${Date.now()}`;
    const fileName = `uploads/${uploadId}/${file.originalname}`;

    await this.storageService.uploadFile(fileName, file.buffer, file.mimetype);

    const fileRecord = await this.filesService.createFile({
      originalName: file.originalname,
      fileName,
      fileSize: file.size,
      mimeType: file.mimetype,
      password: dto.password,
      passwordEnabled: !!dto.password,
      expiresAt: dto.expiresAt,
    });

    const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';

    return {
      fileId: fileRecord._id.toString(),
      shareId: fileRecord.shareId,
      downloadUrl: `${baseUrl}/download/${fileRecord.shareId}`,
    };
  }
}
