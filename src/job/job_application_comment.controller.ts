import {
  Controller,
  Inject,
  Res,
  Query,
  Param,
  Get,
  UseGuards,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { Logger } from 'winston';
import { Response } from 'express';
import { clone, isEmpty } from 'lodash';

import { LOGGER } from '@src/constants';
import { ResponseService } from '@src/util/response.service';
import { PaginationResult } from '@src/util/pagination.service';
import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { UserDocument } from '@src/user/schemas/user.schema';
import { CurrentUser } from '@src/shared/decorators';
import { JobApplicationComment } from './interfaces';
import { JobApplicationCommentDTO } from './dto/job_application_comment_dto';
import { JobApplicationCommentService } from './job_application_comment.service';

@Controller('job/:jobId/application/:appId/comment')
export class JobApplicationCommentController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private jobApplicationCommentService: JobApplicationCommentService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: {
        service: 'JobApplicationCommentController',
        module: 'Job',
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(
    @Res() res: Response,
    @Query()
    query: {
      perPage: number;
      page: number;
    },
    @Param()
    params: {
      appId: string;
      jobId: string;
    },
  ): Promise<any> {
    const { perPage, page } = query;
    try {
      let message: string;
      const payload: PaginationResult<JobApplicationComment> =
        await this.jobApplicationCommentService.fetchComments(
          params.appId,
          params.jobId,
          page,
          perPage,
        );
      message = 'Comments fetched';
      if (isEmpty(payload.data)) {
        message = 'No comments found';
      }

      return this.responseService.json(
        res,
        200,
        message,
        payload.data,
        payload.metadata,
      );
    } catch (e) {
      this.logger.error(
        `issue retrieving job application comments ${e.message}`,
      );
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @CurrentUser() currentUser: UserDocument,
    @Res() res: Response,
    @Param('appId') application: string,
    @Param('jobId') job: string,
    @Body() input: JobApplicationCommentDTO,
  ): Promise<any> {
    const user = clone(currentUser) as UserDocument;

    try {
      const applicationComment =
        await this.jobApplicationCommentService.createJobApplicationComment(
          user,
          application,
          job,
          input,
          this.logger,
        );
      return this.responseService.json(
        res,
        200,
        'Job application comment created successfully',
        applicationComment,
      );
    } catch (error) {
      this.logger.error(
        `issue creating a job application comment : ${error.message}`,
      );
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:commentId')
  async delete(
    @CurrentUser() currentUser: UserDocument,
    @Res() res: Response,
    @Param('commentId') comment: string,
  ): Promise<any> {
    const user = clone(currentUser) as UserDocument;
    try {
      await this.jobApplicationCommentService.deleteApplicationComment(
        comment,
        user,
        this.logger,
      );

      return this.responseService.json(
        res,
        204,
        'Job application comment deleted successfully',
      );
    } catch (error) {
      this.logger.error(`issue deleting comment : ${error.message}`);
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:commentId')
  async update(
    @CurrentUser() currentUser: UserDocument,
    @Res() res: Response,
    @Param('commentId') comment: string,
    @Body() input: JobApplicationCommentDTO,
  ): Promise<any> {
    const user = clone(currentUser) as UserDocument;
    try {
      const applicationComment =
        await this.jobApplicationCommentService.updateApplicationComment(
          comment,
          user,
          input,
          this.logger,
        );
      return this.responseService.json(
        res,
        200,
        'Job application comment updated successfully',
        applicationComment,
      );
    } catch (error) {
      this.logger.error(`issue updating a comment : ${error.message}`);
      return this.responseService.json(res, error);
    }
  }
}
