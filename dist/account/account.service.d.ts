import { UserService } from '@src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { CreateUserDTO, ResetPasswordDTO, UpdateUserDTO } from '@src/user/dto/user.dto';
import { User, UserDocument } from '@src/user/schemas/user.schema';
import { UtilService } from '@src/util/util.service';
import { JobOpening } from '@src/job/schemas/job-opening.schema';
import { JobApplication } from '@src/job';
import { Offer } from '@src/offer/interfaces';
import { PaginationService } from '@src/util/pagination.service';
import { AuditLogService } from '@src/auditlog/auditlog.service';
import { FileUploadDTO } from '@src/uploader/dto';
import { Logger } from '../logger';
export declare class AccountService {
    private readonly userModel;
    private readonly jobOpeningModel;
    private readonly jobApplicationModel;
    private readonly offerModel;
    private jwtService;
    private utilService;
    private userService;
    private paginationService;
    private readonly auditLogService;
    constructor(userModel: Model<User>, jobOpeningModel: Model<JobOpening>, jobApplicationModel: Model<JobApplication>, offerModel: Model<Offer>, jwtService: JwtService, utilService: UtilService, userService: UserService, paginationService: PaginationService, auditLogService: AuditLogService);
    createAdmin(body: CreateUserDTO, createdBy: UserDocument, logger: Logger): Promise<UserDocument>;
    login(user: UserDocument, logger: Logger): Promise<{
        token: string;
    }>;
    validateUser(username: string, password: string, logger: Logger): Promise<any>;
    getLoggedInAdmin(user: UserDocument, logger: Logger): Promise<UserDocument>;
    getAdmins(logger: Logger, page?: number, perPage?: number): Promise<{
        data: import("mongoose").Document<unknown, any, any>[];
        metadata: import("@src/util/pagination.service").PaginationMetaData;
    }>;
    updateAdmin(user: UserDocument, adminId: string, payload: Partial<UpdateUserDTO>, logger: Logger): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteAdmin(user: UserDocument, adminId: string, logger: Logger): Promise<void>;
    updateProfile(user: UserDocument, payload: Partial<UpdateUserDTO>, logger: Logger): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    resetPassword(user: UserDocument, payload: ResetPasswordDTO, logger: Logger): Promise<{
        message: string;
    }>;
    getStats(logger: Logger): Promise<{
        totalJobs: {
            total: number;
            difference: number;
            trend: string;
        };
        activeJobs: {
            total: number;
            difference: number;
            trend: string;
        };
        hiredEmployees: {
            total: number;
            difference: number;
            trend: string;
        };
        pendingReviews: {
            total: number;
            difference: number;
            trend: string;
        };
    }>;
    fetchDashboardStats(logger: Logger): Promise<any>;
    fetchJobEngagementOverview(logger: Logger): Promise<{
        jobsRead: {
            thisYear: any;
            prevYear: any;
        };
        jobsApplied: {
            thisYear: any;
            prevYear: any;
        };
    }>;
    formatJobEngagementResponse(response: any): Promise<any>;
    uploadFile(fileUploadDTO: FileUploadDTO): Promise<import("aws-sdk/clients/s3").ManagedUpload.SendData>;
    private getTrend;
}
