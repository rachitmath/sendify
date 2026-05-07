import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { FilesService } from '../../files/files.service';

@Processor('cleanup')
export class CleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(CleanupProcessor.name);

  constructor(private readonly filesService: FilesService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log('Starting cleanup job...');

    const expiredFiles = await this.filesService.cleanupExpiredFiles();
    const incompleteUploads = await this.filesService.cleanupIncompleteUploads();

    this.logger.log(
      `Cleanup complete: ${expiredFiles} files deleted, ${incompleteUploads} incomplete uploads removed`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Cleanup job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Cleanup job ${job.id} failed: ${error.message}`);
  }
}
