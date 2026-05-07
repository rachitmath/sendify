import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { CleanupProcessor } from './processors/cleanup.processor';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cleanup',
    }),
    FilesModule,
  ],
  providers: [QueueService, CleanupProcessor],
  exports: [QueueService],
})
export class QueueModule {}
