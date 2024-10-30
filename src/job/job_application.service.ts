import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@src/constants';
import { FileUploadDTO } from '@src/uploader/dto';
import { UploadService } from '@src/uploader/uploader.service';
import { UtilService } from '@src/util/util.service';
import { ClientSession, Connection, Model, Types } from 'mongoose';

import { Logger } from 'winston';

import { isEmpty, words } from 'lodash';
import { FileUpload } from '@src/uploader/interfaces';
import { UserDocument } from '@src/user/schemas/user.schema';
import { Meeting } from '@src/meeting/schemas/meeting.schema';
import { OfferService } from '@src/offer/offer.service';
import { JobOpening } from './schemas/job-opening.schema';
import {
  CVUploadDTO,
  JobApplicationAgendaMoveInput,
  ToggleApplicationStatusDTO,
} from './dto/job_application_dtos';
import {
  JobApplication,
  JobApplicationAgenda,
} from './interfaces/job.interface';
import {
  AgendaStatus,
  AgendaType,
  JobApplicationStatus,
  JobOpeningStatus,
  ParsedCVData,
} from './types';
import { JobService } from './job.service';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel(SCHEMAS.JOB_APPLICATION)
    private readonly jobApplicationModel: Model<JobApplication>,
    @InjectModel(SCHEMAS.JOB_APPLICATION_AGENDA)
    private readonly jobApplicationAgendaModel: Model<JobApplicationAgenda>,
    @InjectConnection() private readonly connection: Connection,
    private jobService: JobService,
    private offerService: OfferService,
    private uploadService: UploadService,
    private utilService: UtilService,
  ) {}

  async createJobApplication(
    jobId: string,
    input: CVUploadDTO,
    logger: Logger,
  ): Promise<JobApplication> {
    logger.info('creating job applications from uploads');
    try {
      const jobOpening = await this.jobService.findOneJobByQuery({
        _id: jobId,
        isDeleted: { $ne: true },
      });

      if (isEmpty(jobOpening)) {
        throw new Error('Invalid Job Opening Specified');
      }

      if (jobOpening.status === JobOpeningStatus.Closed) {
        throw new Error('Job Opening is unavailable');
      }

      const res = await this.utilService.convertFileUploadCVToPdf(
        jobOpening.companyName,
        jobOpening.id,
        input as FileUploadDTO,
        logger,
      );

      input.data = res.data;
      input.mime = res.mime;
      input.filename = res.filename;

      const application = await this.createJobApplicationFromParsedData(
        jobOpening,
        input,
        {
          name: `${input.firstname} ${input.lastname}`,
          email: input.email,
          phone: input.phonenumber,
        },
        logger,
      );

      return application;
    } catch (error) {
      logger.error(`issue creating job application: ${error.message}`);
      throw error;
    }
  }

  async createJobApplicationFromParsedData(
    jobOpening: JobOpening,
    upload: FileUpload,
    parsedData: ParsedCVData,
    log: Logger,
  ): Promise<JobApplication> {
    const logger = log.child({
      email: parsedData?.email,
      name: parsedData?.name,
    });

    logger.info(
      `starting db transaction to create job application email: ${parsedData?.email} name: ${parsedData.name} filename: ${upload.filename}`,
    );

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const names = words(parsedData.name);
      const [firstname, lastname] = names;

      let [application] = await this.jobApplicationModel.create(
        [
          {
            firstname,
            lastname,
            email: parsedData?.email,
            phonenumber: parsedData.phone,
            job: new Types.ObjectId(jobOpening.id),
            agendas: [],
            parsedData,
          },
        ],
        { session },
      );

      logger.info('job application record created');
      application = await application.populate('job');

      const { agendas } = jobOpening;

      const applicationAgendas = await Promise.all(
        agendas.map(async (agenda) => {
          const applicationAgenda = {
            type: agenda,
            jobApplication: application.id,
          } as JobApplicationAgenda;

          if (agenda === AgendaType.CV) {
            applicationAgenda.status = AgendaStatus.Active;
            applicationAgenda.title = agenda;
          } else {
            applicationAgenda.title = agenda;
          }

          return applicationAgenda;
        }),
      );

      const createApplicationAgendas =
        await this.jobApplicationAgendaModel.create(applicationAgendas, {
          session,
        });
      logger.info('job application agendas created');

      application.agendas = createApplicationAgendas.map(
        (applicationAgenda) => applicationAgenda._id as any,
      );

      const resource = await this.uploadService.uploadCV(
        jobOpening.companyName,
        jobOpening.id,
        upload,
        logger,
      );

      application.cvUrl = resource;
      await application.save();
      await session.commitTransaction();

      logger.info(
        `job application create session committed: ${application.id}`,
      );

      return application;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      logger.info(`session ended for job application upload`);
    }
  }

  async moveToStage(
    jobApplicationID: string,
    input: JobApplicationAgendaMoveInput,
    logger: Logger,
  ): Promise<void> {
    logger.info(`move job application ${jobApplicationID} to specified agenda`);

    const [currentActiveAgenda, newActiveAgenda] = await Promise.all([
      this.jobApplicationAgendaModel.findOne({
        _id: input.currentAgendaID,
        jobApplication: jobApplicationID,
      }),
      this.jobApplicationAgendaModel
        .findOne({
          _id: input.activeAgendaID,
          jobApplication: jobApplicationID,
        })
        .populate({
          path: 'jobApplication',
          populate: [{ path: 'job', select: 'title' }],
        }),
    ]);

    if (isEmpty(currentActiveAgenda) || isEmpty(newActiveAgenda)) {
      throw new Error('Invalid  Application Agenda');
    }

    currentActiveAgenda.status = AgendaStatus.Done;
    newActiveAgenda.status = AgendaStatus.Active;

    await Promise.all([currentActiveAgenda.save(), newActiveAgenda.save()]);
  }

  async findApplicationById(
    applicationId: string,
    logger: Logger,
  ): Promise<JobApplication> {
    logger.info(`finding job application with id ${applicationId}`);

    return this.jobApplicationModel
      .findOne({ _id: applicationId, isDeleted: false })
      .populate('job');
  }

  async toggleApplicationStatus(
    user: UserDocument,
    applicationId: string,
    input: ToggleApplicationStatusDTO,
    logger: Logger,
  ): Promise<any> {
    const session = await this.connection.startSession();
    const { status, activeAgendaID } = input;
    logger.info(
      `toggle job application with id ${applicationId} by user ${user.id} to status ${status}`,
    );
    session.startTransaction();
    const application = await this.jobApplicationModel
      .findOne({ _id: applicationId, isDeleted: false })
      .populate('job');

    let agenda;
    if (!application) {
      throw new Error('Job Application not found');
    }

    try {
      if (status === JobApplicationStatus.Active) {
        if (application.status !== JobApplicationStatus.Rejected) {
          throw new Error('Unable to restore non rejected application');
        }
        if (activeAgendaID) {
          agenda = await this.jobApplicationAgendaModel.findOne({
            _id: activeAgendaID,
            isDeleted: false,
            jobApplication: applicationId,
          });
        }
        application.status = JobApplicationStatus.Active;
        await application.save({ session });
        if (agenda) {
          agenda.status = AgendaStatus.Active;
          await agenda.save({ session });
        } else {
          await this.jobApplicationAgendaModel.updateMany(
            {
              jobApplication: applicationId,
            },
            { status: AgendaStatus.Scheduled },
            { session },
          );
          await this.jobApplicationAgendaModel.updateOne(
            {
              jobApplication: applicationId,
              type: AgendaType.CV,
            },
            { status: AgendaStatus.Active },
            { session },
          );
        }
      } else {
        if (application.status === JobApplicationStatus.Rejected) {
          throw new Error('Application already rejected');
        }
        application.status = JobApplicationStatus.Rejected;
        await application.save({ session });
        await this.jobApplicationAgendaModel.updateMany(
          {
            jobApplication: applicationId,
          },
          { status: AgendaStatus.Done },
          { session },
        );
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async setApplicationAgendaMeeeting(
    applicationAgendaId: string,
    meeting: Meeting,
    logger: Logger,
    session: ClientSession,
  ): Promise<void> {
    logger.info('update job application agenda with meeting');

    await this.jobApplicationAgendaModel.findOneAndUpdate(
      {
        _id: applicationAgendaId,
      },
      { meeting },
      {
        useFindAndModify: false,
        session,
        new: true,
      },
    );
  }

  async cancelApplicationOffer(
    user: UserDocument,
    applicationID: string,
    logger: Logger,
    reason?: string,
  ): Promise<any> {
    const session = await this.connection.startSession();
    logger.info(
      `Cancel offer  job application with id ${applicationID} by user ${user.id}`,
    );

    session.startTransaction();
    const application = await this.findApplicationById(applicationID, logger);
    if (!application) {
      throw new Error('Job Application not found');
    }

    try {
      const offer = await this.offerService.findOfferByJobApplication(
        applicationID,
        logger,
      );

      if (offer) {
        await this.offerService.cancelOffer(offer.id, logger, reason, session);
      }
      application.status = JobApplicationStatus.Rejected;
      await application.save({ session });

      await session.commitTransaction();
      //  await this.auditLogService.createAuditLog(
      //    user,
      //    `Canceled a job application's offer`,
      //    logger,
      //  );
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
