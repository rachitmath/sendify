import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly config: Record<string, string | undefined>;

  constructor() {
    this.config = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      API_PREFIX: process.env.API_PREFIX,
      MONGODB_URI: process.env.MONGODB_URI,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
      AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      RATE_LIMIT_TTL: process.env.RATE_LIMIT_TTL,
      RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
      MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
      CHUNK_SIZE: process.env.CHUNK_SIZE,
      UPLOAD_EXPIRY_HOURS: process.env.UPLOAD_EXPIRY_HOURS,
      CORS_ORIGINS: process.env.CORS_ORIGINS,
    };
  }

  get(key: string): string | undefined {
    return this.config[key];
  }

  getOrThrow(key: string): string {
    const value = this.config[key];
    if (!value) {
      throw new Error(`Configuration key "${key}" is not defined`);
    }
    return value;
  }

  getNumber(key: string): number {
    const value = this.config[key];
    if (!value) return 0;
    return parseInt(value, 10);
  }

  getBoolean(key: string): boolean {
    const value = this.config[key];
    return value === 'true' || value === '1';
  }
}
