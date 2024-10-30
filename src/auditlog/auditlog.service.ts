import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUDIT_LOG } from '@src/constants/schema_constants';
import { UserDocument } from '@src/user/schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';
import {
  PaginationResult,
  PaginationService,
} from '@src/util/pagination.service';
import { AuditLog, AuditLogDocument } from './interfaces/audit.log.interface';
import { Logger } from '../logger';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AUDIT_LOG)
    private readonly auditLogModel: Model<AuditLogDocument>,
    private paginationService: PaginationService,
  ) {}

  async listAuditLogs(
    logger: Logger,
    search?: string,
    doneBy?: string,
    startDate?: Date,
    endDate?: Date,
    page = 1,
    perPage = 10,
  ): Promise<PaginationResult<AuditLog>> {
    logger.info('fetching audit logs');
    const query: FilterQuery<AuditLogDocument> = {
      isDeleted: { $ne: true },
    };
    if (doneBy) {
      query.doneBy = doneBy;
    }

    if (startDate) {
      query.createdAt = {
        $gte: startDate,
      };
    }
    if (endDate) {
      query.createdAt = {
        ...query.createdAt,
        $lte: endDate,
      };
    }
    if (search) {
      query.message = {
        $regex: search,
        $options: 'i',
      };
    }

    const response = await this.paginationService.paginate(
      this.auditLogModel as any,
      query,
      'message doneBy createdAt',
      page,
      perPage,
      ['doneBy'],
      [{ createdAt: -1 }],
    );

    return response as any;
  }

  async createAuditLog(
    user: UserDocument,
    message: string,
    logger: Logger,
    payload?: any,
  ) {
    logger.info('creating audit log');

    return this.auditLogModel.create({
      doneBy: user.id,
      message,
      payload,
    });
  }
}
