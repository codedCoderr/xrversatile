import Logger from '@src/logger/winston.service';
import { ResponseService } from '@src/util';
import { Response } from 'express';
import { AuditLogService } from './auditlog.service';
export declare class AuditLogController {
    private readonly auditLogService;
    private responseService;
    private logger;
    constructor(logger: Logger, auditLogService: AuditLogService, responseService: ResponseService);
    list(res: Response, input: {
        perPage: number;
        page: number;
        search: string;
        doneBy: string;
        startDate: Date;
        endDate: Date;
    }): Promise<any>;
}
