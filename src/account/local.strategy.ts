import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';

import { LOGGER } from '../constants';
import { Logger } from '../logger';
import { UtilService } from '../util/util.service';
import { AccountService } from './account.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private accountService: AccountService,
    private utilService: UtilService,
    @Inject(LOGGER) private logger: Logger,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.info('validating user credentials');
    const user = await this.accountService.validateUser(
      this.utilService.trimAndLowerCase(username),
      password,
      this.logger,
    );

    if (!user) {
      this.logger.info('invalid user credentials');
      throw new UnauthorizedException();
    }

    this.logger.info('valid user credentials');
    return user;
  }
}
