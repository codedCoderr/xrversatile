import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LOGGER } from '../constants';
import { factory } from './winston.service';

@Module({
  providers: [
    {
      provide: LOGGER,
      useFactory: factory,
      inject: [ConfigService],
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}
