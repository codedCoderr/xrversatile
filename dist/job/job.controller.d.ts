import { Request, Response } from 'express';
import { UserDocument } from '@src/user/schemas/user.schema';
import { ResponseService } from '@src/util/response.service';
import { Logger } from 'winston';
import { JobService } from './job.service';
import { JobOpeningDTO, UpdateJobOpeningStatusDTO } from './dto/job_opening_dtos';
import { JobOpeningStatus } from './types';
export declare class JobController {
    private jobService;
    private responseService;
    private logger;
    constructor(logger: Logger, jobService: JobService, responseService: ResponseService);
    create(body: JobOpeningDTO, res: Response, currentUser: UserDocument): Promise<any>;
    list(res: Response, input: {
        perPage: number;
        page: number;
        status: JobOpeningStatus;
        search: string;
    }): Promise<any>;
    listPublic(res: Response, input: {
        perPage: number;
        page: number;
        search: string;
    }): Promise<any>;
    update(res: Response, param: {
        id: string;
    }, currentUser: UserDocument, updates: Partial<JobOpeningDTO>): Promise<any>;
    changeStatus(req: Request, param: {
        id: string;
    }, body: UpdateJobOpeningStatusDTO, res: Response, currentUser: UserDocument): Promise<any>;
    delete(res: Response, param: {
        id: string;
    }, currentUser: UserDocument): Promise<any>;
    listApplications(res: Response, id: string, query: {
        search?: string;
    }): Promise<any>;
    fetchJob(param: {
        id: string;
    }, res: Response): Promise<any>;
    fetchJobPublic(param: {
        id: string;
    }, res: Response): Promise<any>;
}
