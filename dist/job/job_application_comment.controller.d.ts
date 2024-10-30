import { Logger } from 'winston';
import { Response } from 'express';
import { ResponseService } from '@src/util/response.service';
import { UserDocument } from '@src/user/schemas/user.schema';
import { JobApplicationCommentDTO } from './dto/job_application_comment_dto';
import { JobApplicationCommentService } from './job_application_comment.service';
export declare class JobApplicationCommentController {
    private jobApplicationCommentService;
    private responseService;
    private logger;
    constructor(logger: Logger, jobApplicationCommentService: JobApplicationCommentService, responseService: ResponseService);
    list(res: Response, query: {
        perPage: number;
        page: number;
    }, params: {
        appId: string;
        jobId: string;
    }): Promise<any>;
    create(currentUser: UserDocument, res: Response, application: string, job: string, input: JobApplicationCommentDTO): Promise<any>;
    delete(currentUser: UserDocument, res: Response, comment: string): Promise<any>;
    update(currentUser: UserDocument, res: Response, comment: string, input: JobApplicationCommentDTO): Promise<any>;
}
