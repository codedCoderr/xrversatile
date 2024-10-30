import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JOB_APPLICATION,
  JOB_APPLICATION_AGENDA,
  JOB_APPLICATION_COMMENT,
  JOB_OPENING,
  OFFER,
} from '@src/constants/schema_constants';
import { UploaderModule } from '@src/uploader/uploader.module';
import { OfferSchema } from '@src/offer/schemas/offer.schema';
import { AuditLogModule } from '@src/auditlog/auditlog.module';
import { OfferModule } from '@src/offer/offer.module';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobApplicationService } from './job_application.service';
import { JobApplicationController } from './job_application.controller';
import { JobApplicationCommentController } from './job_application_comment.controller';
import { JobApplicationCommentService } from './job_application_comment.service';
import {
  JobApplicationCommentSchema,
  JobOpeningSchema,
  JobApplicationSchema,
  JobApplicationAgendaSchema,
} from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JOB_OPENING, schema: JobOpeningSchema },
      { name: JOB_APPLICATION, schema: JobApplicationSchema },
      { name: JOB_APPLICATION_AGENDA, schema: JobApplicationAgendaSchema },
      { name: JOB_APPLICATION_COMMENT, schema: JobApplicationCommentSchema },
      { name: OFFER, schema: OfferSchema },
    ]),
    UploaderModule,
    AuditLogModule,
    OfferModule,
  ],
  controllers: [
    JobController,
    JobApplicationController,
    JobApplicationCommentController,
  ],
  providers: [JobService, JobApplicationService, JobApplicationCommentService],
  exports: [JobService, JobApplicationService, JobApplicationCommentService],
})
export class JobModule {}
