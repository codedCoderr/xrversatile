import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { LOGGER } from '@constants/index';
import { json, urlencoded } from 'express';
import { AllExceptionsFilter } from './all-exception.filter';
import corsConfig from './cors.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsConfig,
    bodyParser: false,
    bufferLogs: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get<Logger>(LOGGER)));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;

  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  await app.listen(port);

  const logger = app.get<Logger>(LOGGER);
  logger.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
