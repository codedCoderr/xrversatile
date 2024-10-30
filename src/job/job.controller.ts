import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LOGGER } from '@src/constants';
import { UserDocument } from '@src/user/schemas/user.schema';
import { ResponseService } from '@src/util/response.service';
import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { clone, isEmpty } from 'lodash';
import { CurrentUser } from '@src/shared/decorators';
import { JobService } from './job.service';
import {
  JobOpeningDTO,
  UpdateJobOpeningStatusDTO,
} from './dto/job_opening_dtos';
import { JobOpeningStatus } from './types';

@Controller('job')
export class JobController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private jobService: JobService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: {
        service: 'JobController',
        module: 'Job',
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() body: JobOpeningDTO,
    @Res() res: Response,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<any> {
    try {
      const user = clone(currentUser) as UserDocument;

      const payload = await this.jobService.createJob(body, user, this.logger);

      if (isEmpty(payload)) {
        throw new Error('Failed to create job opening');
      }

      return this.responseService.json(
        res,
        200,
        'Job created successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue creating job: ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(
    @Res() res: Response,
    @Query()
    input: {
      perPage: number;
      page: number;
      status: JobOpeningStatus;
      search: string;
    },
  ): Promise<any> {
    try {
      let message: string;
      const { perPage, page, status, search } = input;

      const payload = await this.jobService.fetchJobOpenings(
        search,
        status,
        page,
        perPage,
      );
      message = 'Job openings fetched successfully';

      if (isEmpty(payload.data.jobs)) {
        message = 'No Job Found';
      }
      return this.responseService.json(
        res,
        200,
        message,
        payload.data,
        payload.metadata,
      );
    } catch (e) {
      this.logger.error(`issue retrieving job opening records ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Get('list-public')
  async listPublic(
    @Res() res: Response,
    @Query()
    input: {
      perPage: number;
      page: number;
      search: string;
    },
  ): Promise<any> {
    try {
      let message: string;
      const { perPage, page, search } = input;

      const payload = await this.jobService.fetchJobOpenings(
        search,
        undefined,
        page,
        perPage,
      );
      message = 'Job openings fetched successfully';

      if (isEmpty(payload.data.jobs)) {
        message = 'No Job Found';
      }
      return this.responseService.json(
        res,
        200,
        message,
        payload.data,
        payload.metadata,
      );
    } catch (e) {
      this.logger.error(`issue retrieving job opening records ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Res() res: Response,
    @Param() param: { id: string },
    @CurrentUser() currentUser: UserDocument,
    @Body() updates: Partial<JobOpeningDTO>,
  ): Promise<any> {
    const jobID: string = param.id;

    try {
      const user = clone(currentUser) as UserDocument;

      const payload = await this.jobService.updateJob(
        jobID,
        user,
        updates,
        this.logger,
      );

      return this.responseService.json(
        res,
        200,
        'Successfully updated job',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue updating job ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/status')
  async changeStatus(
    @Req() req: Request,
    @Param() param: { id: string },
    @Body() body: UpdateJobOpeningStatusDTO,
    @Res() res: Response,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<any> {
    try {
      const { id } = param;
      const user = clone(currentUser) as UserDocument;
      const payload = await this.jobService.updateJobStaus(
        user,
        id,
        body.status,
        this.logger,
      );
      return this.responseService.json(
        res,
        200,
        `Job ${
          body.status === JobOpeningStatus.Active ? 'Resumed' : 'Paused'
        } Successfully`,
        payload,
      );
    } catch (e) {
      this.logger.error(`issue upating job status: ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/delete')
  async delete(
    @Res() res: Response,
    @Param() param: { id: string },
    @CurrentUser() currentUser: UserDocument,
  ): Promise<any> {
    const jobID: string = param.id;

    try {
      const user = clone(currentUser) as UserDocument;

      await this.jobService.deleteJob(user, jobID, this.logger);

      return this.responseService.json(res, 204, 'Successfully deleted Job');
    } catch (e) {
      this.logger.error(`issue deleting job ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/applications')
  async listApplications(
    @Res() res: Response,
    @Param('id') id: string,
    @Query()
    query: {
      search?: string;
    },
  ): Promise<any> {
    try {
      const payload = await this.jobService.fetchJobApplications(
        id,
        query.search,
      );

      return this.responseService.json(
        res,
        200,
        'Job opening applications fetched successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(
        `issue retrieving job opening application records ${e.message}`,
      );
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/details')
  async fetchJob(
    @Param() param: { id: string },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const payload = await this.jobService.fetchJobById(param.id);

      return this.responseService.json(
        res,
        200,
        'Job Fetched Successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue fetching job: ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Get('/:id/details-public')
  async fetchJobPublic(
    @Param() param: { id: string },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const payload = await this.jobService.fetchJobById(param.id, true);

      return this.responseService.json(
        res,
        200,
        'Job Fetched Successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue fetching job: ${e.message}`);
      return this.responseService.json(res, e);
    }
  }
}
