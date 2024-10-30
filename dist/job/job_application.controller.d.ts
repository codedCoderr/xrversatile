import { Logger } from 'winston';
import { Response } from 'express';
import { CVUploadDTO } from '@src/uploader/dto';
import { ResponseService } from '@src/util/response.service';
import { UserDocument } from '@src/user/schemas/user.schema';
import { JobApplicationService } from './job_application.service';
import { JobApplicationAgendaMoveInput, ToggleApplicationStatusDTO } from './dto/job_application_dtos';
export declare class JobApplicationController {
    private jobApplicationService;
    private responseService;
    private logger;
    constructor(logger: Logger, jobApplicationService: JobApplicationService, responseService: ResponseService);
    upload(res: Response, jobId: string, body: CVUploadDTO): Promise<any>;
    moveToStage(res: Response, jobApplicationID: string, body: JobApplicationAgendaMoveInput): Promise<any>;
    toggleApplicationStatus(currentUser: UserDocument, res: Response, param: {
        applicationID: string;
    }, body: ToggleApplicationStatusDTO): Promise<any>;
    cancelJobApplicationOffer(currentUser: UserDocument, res: Response, param: {
        applicationID: string;
    }, input: {
        reason: string;
    }): Promise<any>;
}
