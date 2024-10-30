import { Module } from '@nestjs/common';

import { Logger } from '@logger/index';
import configuration from '@config/env/configuration';
import { UPLOADER, LOGGER } from '@constants/index';
import { HttpAdapterHost } from '@nestjs/core';
import { UploadService } from './uploader.service';
import { Uploader } from './uploader.interface';
import { MockService } from './services/mock/mock.service';
import { S3Service } from './services/s3/s3.service';

@Module({
  providers: [
    {
      provide: UPLOADER,
      useFactory: (logger: Logger, adapter: HttpAdapterHost): Uploader => {
        if (configuration().enableMockUploader) {
          logger.info('using mock uploader');
          return new MockService(logger, adapter);
        }

        logger.info('using aws s3 uploader');
        return new S3Service();
      },
      inject: [LOGGER, HttpAdapterHost],
    },
    UploadService,
  ],
  exports: [UploadService],
})
export class UploaderModule {}
