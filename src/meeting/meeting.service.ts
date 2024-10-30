import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { SCHEMAS } from '@src/constants';

import { User } from '@src/user/schemas/user.schema';
import { Logger } from '@logger/index';
import { JobApplicationService } from '@src/job/job_application.service';
import { ScheduleMeetingInput } from './types';
import { Meeting } from './schemas/meeting.schema';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(SCHEMAS.MEETING)
    private readonly meetingModel: Model<Meeting>,
    @InjectConnection() private readonly connection: Connection,
    private jobApplicationService: JobApplicationService,
  ) {}

  async scheduleMeeting(
    user: User,
    input: ScheduleMeetingInput,
    logger: Logger,
  ): Promise<Meeting> {
    logger.info('scheduling meeting');
    const session = await this.connection.startSession();
    session.startTransaction();

    input.createdBy = user;
    try {
      const meeting = await this.meetingModel.create({
        ...input,
        session,
      });

      if (input.jobApplicationAgenda) {
        await this.jobApplicationService.setApplicationAgendaMeeeting(
          input.jobApplicationAgenda,
          meeting,
          logger,
          session,
        );
      }

      await session.commitTransaction();

      return meeting;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}
