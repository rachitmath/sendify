import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface EmailJobData {
  shareId: string;
  emails: string[];
  fileName: string;
  downloadUrl: string;
  expiresAt: Date;
  message?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async queueShareEmail(data: EmailJobData): Promise<void> {
    await this.emailQueue.add('send-share-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(`Email job queued for shareId: ${data.shareId}`);
  }
}
