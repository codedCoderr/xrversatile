import { Controller, Inject } from '@nestjs/common';

import { LOGGER } from '@constants/index';
import { Logger } from 'winston';

@Controller('user')
export class UserController {
  private logger: Logger;

  constructor(@Inject(LOGGER) logger: Logger) {
    this.logger = logger.child({
      context: {
        service: 'UserController',
        module: 'User',
      },
    });
  }
}
