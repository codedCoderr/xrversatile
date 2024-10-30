import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from '@src/user/schemas/user.schema';
import { isEmpty } from 'lodash';
import { Logger } from 'winston';

import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@src/constants';
import { Connection, FilterQuery, Model, Types } from 'mongoose';
import { PaginationService } from '@src/util/pagination.service';
import { Offer } from '@src/offer/interfaces';
import { AuditLogService } from '@src/auditlog/auditlog.service';
import {
  IFetchJobApplicationsResponse,
  JobApplication,
  JobApplicationAgenda,
} from './interfaces';
import { JobOpening } from './schemas/job-opening.schema';
import { JobOpeningDTO } from './dto/job_opening_dtos';
import {
  JobOpeningStatus,
  AgendaType,
  AgendaStatus,
  JobApplicationStatus,
} from './types';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(SCHEMAS.JOB_OPENING)
    private readonly jobOpeningModel: Model<JobOpening>,
    @InjectModel(SCHEMAS.OFFER)
    private readonly offerModel: Model<Offer>,
    @InjectModel(SCHEMAS.JOB_APPLICATION)
    private readonly jobApplicationModel: Model<JobApplication>,
    @InjectModel(SCHEMAS.JOB_APPLICATION_AGENDA)
    private readonly jobApplicationAgendaModel: Model<JobApplicationAgenda>,
    private paginationService: PaginationService,
    private readonly auditLogService: AuditLogService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createJob(
    jobDTO: JobOpeningDTO,
    user: UserDocument,
    logger: Logger,
  ): Promise<{ id: string; title: string }> {
    logger.info('creating job opening');

    jobDTO.createdBy = user;

    jobDTO.agendas = [];
    jobDTO.agendas.unshift(AgendaType.CV);
    jobDTO.agendas.push(AgendaType.Interview);
    jobDTO.agendas.push(AgendaType.Offer);

    const createdJob = await this.jobOpeningModel.create({
      ...jobDTO,
    });
    await this.auditLogService.createAuditLog(
      user,
      'Created a job',
      logger,
      jobDTO,
    );
    return {
      id: createdJob.id,
      title: createdJob.title,
    };
  }

  async fetchJobOpenings(
    search?: string,
    status?: JobOpeningStatus,
    page = 1,
    perPage = 10,
  ): Promise<{
    data: {
      jobs: any[];
      jobsCount: { active: number; closed: number };
    };
    metadata: any;
  }> {
    const match: FilterQuery<JobOpening> = {
      isDeleted: false,
    };

    if (status) {
      match.status = status;
    }

    if (!isEmpty(search)) {
      match.$and = [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }

    const [totalOrgJobs, paginated] = await Promise.all([
      this.jobOpeningModel
        .find({
          isDeleted: false,
        })
        .select('createdAt status'),
      this.paginationService.paginate(
        this.jobOpeningModel as any,
        match,
        null,
        page,
        perPage,
      ),
    ]);

    const activeJobsCount = totalOrgJobs.filter(
      (job) => job.status === JobOpeningStatus.Active,
    ).length;
    const closedJobsCount = totalOrgJobs.filter(
      (job) => job.status === JobOpeningStatus.Closed,
    ).length;

    const { data, metadata } = paginated;

    if (!data?.length) {
      return {
        data: {
          jobs: [] as any,
          jobsCount: {
            active: activeJobsCount,
            closed: closedJobsCount,
          },
        },
        metadata,
      };
    }

    return {
      data: {
        jobs: data as any,
        jobsCount: {
          active: activeJobsCount,
          closed: closedJobsCount,
        },
      },
      metadata,
    };
  }

  async updateJob(
    jobId: string,
    user: UserDocument,
    updates: Partial<JobOpeningDTO>,
    logger: Logger,
  ): Promise<JobOpening> {
    logger.info(`updating job with id ${jobId}`);

    const existingJob = await this.jobOpeningModel.findOne({
      _id: jobId,
    });

    if (!existingJob) {
      throw new NotFoundException();
    }

    if (!isEmpty(updates.agendas)) {
      updates.agendas.unshift(AgendaType.CV);
      updates.agendas.push(AgendaType.Offer);
    }

    const updatedJob: JobOpening = await this.jobOpeningModel.findOneAndUpdate(
      {
        _id: jobId,
      },
      updates,
      { useFindAndModify: false, new: true },
    );

    if (isEmpty(updatedJob)) {
      throw new Error(`Failed to update job id ${jobId}`);
    }
    await this.auditLogService.createAuditLog(
      user,
      'Updated a job',
      logger,
      updates,
    );

    return updatedJob;
  }

  async updateJobStaus(
    user: UserDocument,
    jobId: string,
    status: JobOpeningStatus,
    logger: Logger,
  ): Promise<JobOpening> {
    logger.info(`updating job status with id ${jobId}`);

    const jobOpeningPayload: { status: JobOpeningStatus; closedAt?: Date } = {
      status,
    };

    if (status === JobOpeningStatus.Closed) {
      jobOpeningPayload.closedAt = new Date();
    }

    const updatedJob = await this.jobOpeningModel.findOneAndUpdate(
      { _id: jobId },
      { ...jobOpeningPayload },
      {
        useFindAndModify: false,
        new: true,
      },
    );

    if (!updatedJob) {
      throw new Error('failed to update job status');
    }

    logger.info(`successfully updated job status, title ${updatedJob.title}`);

    await this.auditLogService.createAuditLog(
      user,
      `Updated a job's status`,
      logger,
      status,
    );
    return updatedJob;
  }

  async deleteJob(
    user: UserDocument,
    jobID: string,
    logger: Logger,
  ): Promise<void> {
    logger.info(`deleting job with id ${jobID}`);
    await this.jobOpeningModel.findOneAndUpdate(
      { _id: jobID, isDeleted: { $ne: true } },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        useFindAndModify: false,
        new: true,
      },
    );

    await this.auditLogService.createAuditLog(user, 'Deleted a job', logger);
  }

  async findOneJobByQuery(query: FilterQuery<JobOpening>): Promise<JobOpening> {
    return this.jobOpeningModel.findOne(query);
  }

  async fetchJobApplications(
    jobID: string,
    search?: string,
  ): Promise<IFetchJobApplicationsResponse> {
    const criteria: FilterQuery<JobApplication> = {
      job: new Types.ObjectId(jobID),
      isDeleted: false,
    };

    if (!isEmpty(search)) {
      const $and = [
        {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { firstname: { $regex: search, $options: 'i' } },
            { lastname: { $regex: search, $options: 'i' } },
            { middlename: { $regex: search, $options: 'i' } },
          ],
        },
      ];

      criteria.$and = $and;
    }

    const [job, jobApplications] = await Promise.all([
      this.jobOpeningModel
        .findOne({
          _id: new Types.ObjectId(jobID),
          isDeleted: false,
        })
        .select('agendas'),
      this.jobApplicationModel.find(criteria),
    ]);

    const reformedData = (await Promise.all(
      jobApplications.map(async (record) => {
        const offer = await this.offerModel
          .findOne({
            application: record.id,
            job: record.job,
            isDeleted: false,
          })
          .select('documentUrl cancelReason content subject resumptionDate');

        const jobAppAgendas = [];

        // resolve agendas
        await Promise.all(
          job?.agendas.map(async (ag) => {
            const updated = await this.jobApplicationAgendaModel
              .findOneAndUpdate(
                {
                  type: { $regex: ag, $options: 'i' },
                  jobApplication: record.id,
                },
                {
                  type: ag,
                  title: ag,
                  jobApplication: record.id,
                },
                {
                  new: true,
                  upsert: true,
                },
              )
              .populate([
                {
                  path: 'meeting',
                },
              ]);

            jobAppAgendas.push({ ...updated.toJSON(), offer });
          }),
        );

        return {
          ...record.toJSON(),
          agendas: jobAppAgendas,
          offer,
        };
      }),
    )) as any[];

    const stageMap: any = {
      cv: 'cv',
      offer: 'offer',
    };

    const result: IFetchJobApplicationsResponse = {
      rejected: [],
      cv: [],
      offer: [],
    };
    const cvAgendaIds = [];

    // initialize result and stage map with various agenda stages
    ((job.agendas as string[]) || []).forEach((agenda) => {
      const isAgendaInMap = agenda in result;

      if (!isAgendaInMap) {
        result[agenda] = [];
        stageMap[agenda] = agenda;
      }
    });

    reformedData.forEach((jobApp) => {
      if (jobApp.status === JobApplicationStatus.Rejected) {
        result.rejected.push(jobApp);
        return;
      }
      if (jobApp.status === JobApplicationStatus.OfferAccepted) {
        result.offer.push(jobApp);
        return;
      }
      if (jobApp.status === JobApplicationStatus.OfferCountered) {
        result.offer.push(jobApp);
        return;
      }

      const agendas = jobApp?.agendas as JobApplicationAgenda[];

      const activeAgenda = agendas.find(
        (agend) => agend.status === AgendaStatus.Active,
      );

      if (activeAgenda) {
        result[stageMap[activeAgenda.type]]?.push(jobApp);
      } else if (jobApp.status !== JobApplicationStatus.OfferRejected) {
        result.cv.push(jobApp);
        const cvAgend = agendas.find((agend) => agend.type === AgendaType.CV);
        if (!isEmpty(cvAgend)) {
          cvAgendaIds.push(cvAgend.id);
        }
      }
    });

    if (!isEmpty(cvAgendaIds)) {
      await this.jobApplicationAgendaModel.updateMany(
        {
          _id: { $in: cvAgendaIds },
        },
        { status: AgendaStatus.Active },
      );
    }

    return result;
  }

  async fetchJobById(jobId: string, isPublic = false): Promise<JobOpening> {
    const $and: any = [{ _id: jobId }, { isDeleted: { $ne: true } }];

    const criteria = { $and };

    const job = await this.jobOpeningModel
      .findOne(criteria)
      .populate('createdBy');

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (isPublic) {
      job.reads.push(new Date());
      job.save();
    }

    return job;
  }
}
