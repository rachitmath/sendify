import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('cleanup') private cleanupQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.scheduleCleanupJob();
  }

  private async scheduleCleanupJob(): Promise<void> {
    await this.cleanupQueue.add(
      'cleanup-expired',
      {},
      {
        repeat: {
          pattern: '*/5 * * * *',
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    this.logger.log('Cleanup job scheduled to run every 5 minutes');
  }
}
