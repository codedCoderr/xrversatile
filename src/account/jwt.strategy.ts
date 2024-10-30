import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';

import configuration from '../config/env/configuration';
import { LOGGER } from '../constants';
import { Logger } from '../logger';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    @Inject(LOGGER) private logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
    });
  }

  async validate(payload: any): Promise<UserDocument> {
    return this.userService.findByID(payload.id, this.logger);
  }
}
