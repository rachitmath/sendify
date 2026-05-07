import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Upload, UploadSchema } from '../files/schemas/upload.schema';
import { StorageModule } from '../storage/storage.module';
import { FilesModule } from '../files/files.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
    ConfigModule,
    StorageModule,
    FilesModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
