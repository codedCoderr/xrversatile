import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { SCHEMAS, LOGGER } from '@src/constants';
import { Model } from 'mongoose';
import { Logger } from 'winston';

import {
  PaginationResult,
  PaginationService,
} from '@src/util/pagination.service';
import { isEmpty } from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '@src/user/schemas/user.schema';

import { JobApplicationCommentDTO } from './dto/job_application_comment_dto';
import { JobApplication, JobApplicationComment } from './interfaces';
import { JobService } from './job.service';
import { JobApplicationService } from './job_application.service';

@Injectable()
export class JobApplicationCommentService {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    @InjectModel(SCHEMAS.JOB_APPLICATION_COMMENT)
    private readonly jobApplicationCommentModel: Model<JobApplicationComment>,
    private readonly jobService: JobService,
    private readonly jobApplicationService: JobApplicationService,
    private paginationService: PaginationService,
  ) {
    this.logger = logger.child({
      context: {
        service: 'JobApplicationCommentService',
        module: 'Job',
      },
    });
  }

  async createJobApplicationComment(
    user: UserDocument,
    applicationId: string,
    jobId: string,
    comment: JobApplicationCommentDTO,
    logger: Logger,
  ): Promise<JobApplicationComment> {
    logger.info(
      `creating comment for job application with id of ${applicationId}`,
    );

    const jobApplication: JobApplication =
      await this.jobApplicationService.findApplicationById(
        applicationId,
        logger,
      );

    if (!jobApplication) {
      throw new Error('Application does not exist');
    }

    const createdComment = await this.jobApplicationCommentModel.create({
      ...comment,
      application: applicationId,
      sender: user,
      job: jobId,
    });

    return createdComment;
  }

  async fetchComments(
    application: string,
    jobId: string,
    page?: number,
    perPage?: number,
  ): Promise<PaginationResult<JobApplicationComment>> {
    const job = await this.jobService.findOneJobByQuery({
      _id: jobId,
      isDeleted: { $ne: true },
    });
    if (isEmpty(job)) {
      throw new Error('Job does not exist');
    }
    const criteria = {
      application,
      isDeleted: false,
    };
    const populate = ['sender'];
    const comments = await this.paginationService.paginate<any>(
      this.jobApplicationCommentModel,
      criteria,
      null,
      page,
      perPage,
      populate,
    );

    return comments;
  }

  async deleteApplicationComment(
    commentId: string,
    user: UserDocument,
    logger: Logger,
  ): Promise<void> {
    logger.info(`deleting comment with id of ${commentId}`);
    const foundComment = await this.jobApplicationCommentModel.findOne({
      _id: commentId,
      isDeleted: { $ne: true },
    });

    if (foundComment.sender.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        `You cannot delete a comment you didn't create`,
      );
    }

    foundComment.isDeleted = true;
    foundComment.deletedAt = new Date();
    foundComment.save();
  }

  async updateApplicationComment(
    commentId: string,
    user: UserDocument,
    input: JobApplicationCommentDTO,
    logger: Logger,
  ): Promise<JobApplicationComment> {
    logger.info(`updating comment with id of ${commentId}`);
    const foundComment = await this.jobApplicationCommentModel.findOne({
      _id: commentId,
      isDeleted: false,
    });

    if (foundComment.sender.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        `You cannot update a comment you didn't create`,
      );
    }

    foundComment.content = input.content;
    foundComment.save();

    // await this.sendCommentEmailNotification(commentId);

    return this.jobApplicationCommentModel.findOne({
      _id: commentId,
      sender: user,
      isDeleted: false,
    });
  }

  async fetchApplicationComment(
    find: Record<string, any>,
    populate?: Record<string, any>,
  ): Promise<JobApplicationComment> {
    const chat = this.jobApplicationCommentModel.findOne(find);
    if (populate && populate.application) {
      chat.populate({
        path: 'application',
        model: SCHEMAS.JOB_APPLICATION,
      });
    }

    if (populate && populate.job) {
      chat.populate({
        path: 'job',
        model: SCHEMAS.JOB_OPENING,
      });
    }
    return chat.lean() as unknown as JobApplicationComment;
  }
}
