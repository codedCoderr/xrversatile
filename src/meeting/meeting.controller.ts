import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { LOGGER } from '@src/constants';
import { ResponseService } from '@src/util/response.service';
import Logger from '@src/logger/winston.service';
import { UserDocument } from '@src/user/schemas/user.schema';
import { CurrentUser } from '@src/shared/decorators';
import { clone } from 'lodash';
import { MeetingService } from './meeting.service';
import { ScheduleMeetingInput } from './types';

@Controller('meeting')
export class MeetingController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private responseService: ResponseService,
    private meetingService: MeetingService,
  ) {
    this.logger = logger.child({
      context: { service: 'MeetingController', module: 'Meeting' },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('schedule')
  async schedule(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() currentUser: UserDocument,
    @Body() input: ScheduleMeetingInput,
  ): Promise<any> {
    const user = clone(currentUser) as UserDocument;

    try {
      const meeting = await this.meetingService.scheduleMeeting(
        user,
        input,
        this.logger,
      );

      return this.responseService.json(
        res,
        200,
        'Meeting scheduled successfully',
        meeting,
      );
    } catch (error) {
      this.logger.error(`issue scheduling meeting: ${error.message}`);
      return this.responseService.json(res, error);
    }
  }
}
