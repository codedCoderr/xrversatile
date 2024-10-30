import { Connection, Model } from 'mongoose';
import { User } from '@src/user/schemas/user.schema';
import { Logger } from '@logger/index';
import { JobApplicationService } from '@src/job/job_application.service';
import { ScheduleMeetingInput } from './types';
import { Meeting } from './schemas/meeting.schema';
export declare class MeetingService {
    private readonly meetingModel;
    private readonly connection;
    private jobApplicationService;
    constructor(meetingModel: Model<Meeting>, connection: Connection, jobApplicationService: JobApplicationService);
    scheduleMeeting(user: User, input: ScheduleMeetingInput, logger: Logger): Promise<Meeting>;
}
