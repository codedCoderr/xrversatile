import { Request, Response } from 'express';
import { ResponseService } from '@src/util/response.service';
import Logger from '@src/logger/winston.service';
import { UserDocument } from '@src/user/schemas/user.schema';
import { MeetingService } from './meeting.service';
import { ScheduleMeetingInput } from './types';
export declare class MeetingController {
    private responseService;
    private meetingService;
    private logger;
    constructor(logger: Logger, responseService: ResponseService, meetingService: MeetingService);
    schedule(req: Request, res: Response, currentUser: UserDocument, input: ScheduleMeetingInput): Promise<any>;
}
