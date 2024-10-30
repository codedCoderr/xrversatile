import { Model } from 'mongoose';
import { Logger } from 'winston';
import { PaginationResult, PaginationService } from '@src/util/pagination.service';
import { UserDocument } from '@src/user/schemas/user.schema';
import { JobApplicationCommentDTO } from './dto/job_application_comment_dto';
import { JobApplicationComment } from './interfaces';
import { JobService } from './job.service';
import { JobApplicationService } from './job_application.service';
export declare class JobApplicationCommentService {
    private readonly jobApplicationCommentModel;
    private readonly jobService;
    private readonly jobApplicationService;
    private paginationService;
    private logger;
    constructor(logger: Logger, jobApplicationCommentModel: Model<JobApplicationComment>, jobService: JobService, jobApplicationService: JobApplicationService, paginationService: PaginationService);
    createJobApplicationComment(user: UserDocument, applicationId: string, jobId: string, comment: JobApplicationCommentDTO, logger: Logger): Promise<JobApplicationComment>;
    fetchComments(application: string, jobId: string, page?: number, perPage?: number): Promise<PaginationResult<JobApplicationComment>>;
    deleteApplicationComment(commentId: string, user: UserDocument, logger: Logger): Promise<void>;
    updateApplicationComment(commentId: string, user: UserDocument, input: JobApplicationCommentDTO, logger: Logger): Promise<JobApplicationComment>;
    fetchApplicationComment(find: Record<string, any>, populate?: Record<string, any>): Promise<JobApplicationComment>;
}
