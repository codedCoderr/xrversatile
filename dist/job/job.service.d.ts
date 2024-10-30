import { UserDocument } from '@src/user/schemas/user.schema';
import { Logger } from 'winston';
import { Connection, FilterQuery, Model } from 'mongoose';
import { PaginationService } from '@src/util/pagination.service';
import { Offer } from '@src/offer/interfaces';
import { AuditLogService } from '@src/auditlog/auditlog.service';
import { IFetchJobApplicationsResponse, JobApplication, JobApplicationAgenda } from './interfaces';
import { JobOpening } from './schemas/job-opening.schema';
import { JobOpeningDTO } from './dto/job_opening_dtos';
import { JobOpeningStatus } from './types';
export declare class JobService {
    private readonly jobOpeningModel;
    private readonly offerModel;
    private readonly jobApplicationModel;
    private readonly jobApplicationAgendaModel;
    private paginationService;
    private readonly auditLogService;
    private readonly connection;
    constructor(jobOpeningModel: Model<JobOpening>, offerModel: Model<Offer>, jobApplicationModel: Model<JobApplication>, jobApplicationAgendaModel: Model<JobApplicationAgenda>, paginationService: PaginationService, auditLogService: AuditLogService, connection: Connection);
    createJob(jobDTO: JobOpeningDTO, user: UserDocument, logger: Logger): Promise<{
        id: string;
        title: string;
    }>;
    fetchJobOpenings(search?: string, status?: JobOpeningStatus, page?: number, perPage?: number): Promise<{
        data: {
            jobs: any[];
            jobsCount: {
                active: number;
                closed: number;
            };
        };
        metadata: any;
    }>;
    updateJob(jobId: string, user: UserDocument, updates: Partial<JobOpeningDTO>, logger: Logger): Promise<JobOpening>;
    updateJobStaus(user: UserDocument, jobId: string, status: JobOpeningStatus, logger: Logger): Promise<JobOpening>;
    deleteJob(user: UserDocument, jobID: string, logger: Logger): Promise<void>;
    findOneJobByQuery(query: FilterQuery<JobOpening>): Promise<JobOpening>;
    fetchJobApplications(jobID: string, search?: string): Promise<IFetchJobApplicationsResponse>;
    fetchJobById(jobId: string, isPublic?: boolean): Promise<JobOpening>;
}
