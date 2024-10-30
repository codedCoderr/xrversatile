import { UserDocument } from '@src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { PaginationResult, PaginationService } from '@src/util/pagination.service';
import { AuditLog, AuditLogDocument } from './interfaces/audit.log.interface';
import { Logger } from '../logger';
export declare class AuditLogService {
    private readonly auditLogModel;
    private paginationService;
    constructor(auditLogModel: Model<AuditLogDocument>, paginationService: PaginationService);
    listAuditLogs(logger: Logger, search?: string, doneBy?: string, startDate?: Date, endDate?: Date, page?: number, perPage?: number): Promise<PaginationResult<AuditLog>>;
    createAuditLog(user: UserDocument, message: string, logger: Logger, payload?: any): Promise<import("mongoose").Document<unknown, {}, AuditLogDocument> & AuditLog & Document & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
