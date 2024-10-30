import { Controller, Get, Inject, Query, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { LOGGER } from '@src/constants';
import Logger from '@src/logger/winston.service';

import { ResponseService } from '@src/util';
import { Response } from 'express';
import { AuditLogService } from './auditlog.service';

@Controller('auditlog')
export class AuditLogController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private readonly auditLogService: AuditLogService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: { service: 'AuditLogController', module: 'AuditLog' },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async list(
    @Res() res: Response,
    @Query()
    input: {
      perPage: number;
      page: number;
      search: string;
      doneBy: string;
      startDate: Date;
      endDate: Date;
    },
  ): Promise<any> {
    try {
      const { perPage, page, search, doneBy, startDate, endDate } = input;
      const payload = await this.auditLogService.listAuditLogs(
        this.logger,
        search,
        doneBy,
        startDate,
        endDate,
        page,
        perPage,
      );

      return this.responseService.json(
        res,
        200,
        'Audit logs fetched successfully',
        payload.data,
        payload.metadata,
      );
    } catch (error) {
      this.logger.error(`issue fetching audit logs: ${error.message}`);
      return this.responseService.json(res, error);
    }
  }
}
