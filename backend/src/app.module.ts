import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { FilesModule } from './files/files.module';
import { DownloadModule } from './download/download.module';
import { StorageModule } from './storage/storage.module';
import { EmailModule } from './email/email.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI') || 'mongodb://localhost:27017/fileshare',
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.getNumber('RATE_LIMIT_TTL') || 60000,
            limit: configService.getNumber('RATE_LIMIT_MAX') || 100,
          },
        ],
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.getNumber('REDIS_PORT') || 6379,
        },
      }),
    }),
    AuthModule,
    UploadModule,
    FilesModule,
    DownloadModule,
    StorageModule,
    EmailModule,
    QueueModule,
  ],
})
export class AppModule {}
