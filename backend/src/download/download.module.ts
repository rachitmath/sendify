import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';
import { FilesModule } from '../files/files.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [FilesModule, StorageModule],
  controllers: [DownloadController],
  providers: [DownloadService],
  exports: [DownloadService],
})
export class DownloadModule {}
