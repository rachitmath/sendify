import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('API_PREFIX') || 'api');
  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ORIGINS')?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FileShare API')
    .setDescription('Secure file sharing platform API with chunked uploads, password protection, and expiration')
    .setVersion('1.0')
    .addTag('upload', 'File upload endpoints')
    .addTag('files', 'File metadata and sharing')
    .addTag('download', 'File download endpoints')
    .addTag('auth', 'Authentication endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
