import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailJobData } from './email.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<void> {
    this.logger.log(`Processing email job ${job.id} for shareId: ${job.data.shareId}`);

    const { emails, fileName, downloadUrl, expiresAt, message } = job.data;

    for (const email of emails) {
      await this.sendEmail({
        to: email,
        subject: `You have received a file: ${fileName}`,
        html: this.generateEmailTemplate({
          fileName,
          downloadUrl,
          expiresAt,
          message,
        }),
      });
    }

    this.logger.log(`Email sent successfully to ${emails.length} recipients`);
  }

  private async sendEmail(options: { to: string; subject: string; html: string }): Promise<void> {
    this.logger.debug(`Sending email to: ${options.to}`);
    
    console.log(`
========================================
📧 EMAIL NOTIFICATION
========================================
To: ${options.to}
Subject: ${options.subject}
${options.html.replace(/<[^>]*>/g, '')}
========================================
    `);
  }

  private generateEmailTemplate(data: {
    fileName: string;
    downloadUrl: string;
    expiresAt: Date;
    message?: string;
  }): string {
    const expiryDate = new Date(data.expiresAt).toLocaleString();
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563EB; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 24px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📎 You have a file</h1>
    </div>
    <div class="content">
      <p><strong>File:</strong> ${data.fileName}</p>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
      <p><strong>Expires:</strong> ${expiryDate}</p>
      <p>
        <a href="${data.downloadUrl}" class="button">Download File</a>
      </p>
      <p>Or copy this link: <code>${data.downloadUrl}</code></p>
    </div>
    <div class="footer">
      <p>This link will expire on ${expiryDate}</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}
