import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LOGGER } from '@src/constants';
import { Logger } from 'winston';
import { Response } from 'express';
import { clone } from 'lodash';
import { CVUploadDTO } from '@src/uploader/dto';
import { ResponseService } from '@src/util/response.service';
import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { UserDocument } from '@src/user/schemas/user.schema';
import { CurrentUser } from '@src/shared/decorators';
import { JobApplicationService } from './job_application.service';
import {
  JobApplicationAgendaMoveInput,
  ToggleApplicationStatusDTO,
} from './dto/job_application_dtos';
import { JobApplicationStatus } from './types';

@Controller('job/:id/application')
export class JobApplicationController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private jobApplicationService: JobApplicationService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: {
        service: 'JobApplicationController',
        module: 'Job',
      },
    });
  }

  @Post('upload')
  async upload(
    @Res() res: Response,
    @Param('id') jobId: string,
    @Body() body: CVUploadDTO,
  ): Promise<any> {
    try {
      const payload = await this.jobApplicationService.createJobApplication(
        jobId,
        body,
        this.logger,
      );

      return this.responseService.json(
        res,
        200,
        'Job application created successfully',
        payload,
      );
    } catch (error) {
      this.logger.error(
        `issue creating job application from upload: ${error.message}`,
      );
      if (error?.code === 11000) {
        const message = 'You have already applied for this Job';
        return this.responseService.json(res, 409, message);
      }
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':applicationID/move')
  async moveToStage(
    @Res() res: Response,
    @Param('applicationID') jobApplicationID: string,
    @Body() body: JobApplicationAgendaMoveInput,
  ): Promise<any> {
    try {
      await this.jobApplicationService.moveToStage(
        jobApplicationID,
        body,
        this.logger,
      );

      return this.responseService.json(
        res,
        200,
        'Job application agenda successfully moved',
      );
    } catch (error) {
      this.logger.error(
        `issue moving job applications to stage: ${error.message}`,
      );
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:applicationID')
  async toggleApplicationStatus(
    @CurrentUser() currentUser: UserDocument,
    @Res() res: Response,
    @Param() param: { applicationID: string },
    @Body() body: ToggleApplicationStatusDTO,
  ): Promise<any> {
    const user = clone(currentUser) as UserDocument;
    const { applicationID } = param;
    const { status } = body;
    let message: string;
    if (status === JobApplicationStatus.Rejected) {
      message = 'Successfully rejected job application';
    } else if (status === JobApplicationStatus.Active) {
      message = 'Successfully restored job application';
    } else {
      message = 'Successfully updated job application';
    }

    try {
      await this.jobApplicationService.toggleApplicationStatus(
        user,
        applicationID,
        body,
        this.logger,
      );

      return this.responseService.json(res, 200, message);
    } catch (e) {
      this.logger.error(`issue updating job application status ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:applicationID/cancel-offer')
  async cancelJobApplicationOffer(
    @CurrentUser() currentUser: UserDocument,
    @Res() res: Response,
    @Param() param: { applicationID: string },
    @Body() input: { reason: string },
  ): Promise<any> {
    const user = clone(currentUser) as UserDocument;
    const { applicationID } = param;
    try {
      await this.jobApplicationService.cancelApplicationOffer(
        user,
        applicationID,
        this.logger,
        input.reason,
      );

      return this.responseService.json(
        res,
        200,
        "Successfully cancelled job application's offer",
      );
    } catch (e) {
      this.logger.error(
        `issue cancelling job application's offer ${e.message}`,
      );
      return this.responseService.json(res, e);
    }
  }
}
