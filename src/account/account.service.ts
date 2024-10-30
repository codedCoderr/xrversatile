import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { compareSync } from 'bcryptjs';
import { isEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import {
  CreateUserDTO,
  ResetPasswordDTO,
  UpdateUserDTO,
} from '@src/user/dto/user.dto';
import { User, UserDocument } from '@src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@src/constants';
import { UtilService } from '@src/util/util.service';
import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';

import { JobOpening } from '@src/job/schemas/job-opening.schema';
import {
  AgendaStatus,
  AgendaType,
  JobApplication,
  JobApplicationStatus,
  JobOpeningStatus,
} from '@src/job';
import { Offer } from '@src/offer/interfaces';
import { OfferStatus } from '@src/offer/interfaces/offer.interface';
import { PaginationService } from '@src/util/pagination.service';
import { AuditLogService } from '@src/auditlog/auditlog.service';
import { FileUploadDTO } from '@src/uploader/dto';
import { RangeEnums } from './dtos';
import { Logger } from '../logger';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(SCHEMAS.USER)
    private readonly userModel: Model<User>,
    @InjectModel(SCHEMAS.JOB_OPENING)
    private readonly jobOpeningModel: Model<JobOpening>,
    @InjectModel(SCHEMAS.JOB_APPLICATION)
    private readonly jobApplicationModel: Model<JobApplication>,
    @InjectModel(SCHEMAS.OFFER)
    private readonly offerModel: Model<Offer>,
    private jwtService: JwtService,
    private utilService: UtilService,
    private userService: UserService,
    private paginationService: PaginationService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createAdmin(
    body: CreateUserDTO,
    createdBy: UserDocument,
    logger: Logger,
  ): Promise<UserDocument> {
    logger.info('creating admin');
    const password = this.utilService.generateRandom(8);
    try {
      const user = await this.userModel.create({
        ...body,
        password,
      });

      await this.auditLogService.createAuditLog(
        createdBy,
        'Created an admin',
        logger,
        { ...body, password },
      );

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A duplicate record exists');
      }
      throw error;
    }
  }

  async login(user: UserDocument, logger: Logger): Promise<{ token: string }> {
    logger.info('logging in user');

    const token = await this.jwtService.sign({
      id: user.id,
    });

    await this.auditLogService.createAuditLog(user, 'Logged in', logger);

    return { token };
  }

  async validateUser(
    username: string,
    password: string,
    logger: Logger,
  ): Promise<any> {
    logger.info('validating user');

    const user = await this.userService.findByEmail(username, logger);

    if (isEmpty(user)) {
      return null;
    }

    const validPassword = compareSync(password, user.password);
    if (!validPassword) {
      return null;
    }

    return user;
  }

  async getLoggedInAdmin(user: UserDocument, logger: Logger) {
    logger.info('getting logged-in admin');

    return user;
  }

  async getAdmins(logger: Logger, page = 1, perPage = 10) {
    logger.info('fetching admins');
    const { data, metadata } = await this.paginationService.paginate(
      this.userModel as any,
      { isDeleted: { $ne: true } },
      null,
      page,
      perPage,
      [{ createdAt: -1 }],
    );

    return { data, metadata };
  }

  async updateAdmin(
    user: UserDocument,
    adminId: string,
    payload: Partial<UpdateUserDTO>,
    logger: Logger,
  ) {
    logger.info(`updating admin with id ${adminId}`);

    try {
      const updatedAdmin = await this.userModel.findOneAndUpdate(
        { _id: adminId },
        { ...payload },
        { new: true },
      );
      await this.auditLogService.createAuditLog(
        user,
        `Updated an admin's details`,
        logger,
        payload,
      );
      return updatedAdmin;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A duplicate record exists');
      }
      throw error;
    }
  }

  async deleteAdmin(
    user: UserDocument,
    adminId: string,
    logger: Logger,
  ): Promise<void> {
    logger.info(`deleting admin with id ${adminId}`);
    await this.userModel.findOneAndUpdate(
      { _id: adminId, isDeleted: { $ne: true } },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        useFindAndModify: false,
        new: true,
      },
    );

    await this.auditLogService.createAuditLog(user, 'Deleted an admin', logger);
  }

  async updateProfile(
    user: UserDocument,
    payload: Partial<UpdateUserDTO>,
    logger: Logger,
  ) {
    logger.info('updating user profile');
    try {
      const updatedAdmin = await this.userModel.findOneAndUpdate(
        { _id: user.id },
        { ...payload },
        { new: true },
      );
      await this.auditLogService.createAuditLog(
        user,
        `Updated an admin's details`,
        logger,
        payload,
      );
      return updatedAdmin;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A duplicate record exists');
      }
      throw error;
    }
  }

  async resetPassword(
    user: UserDocument,
    payload: ResetPasswordDTO,
    logger: Logger,
  ) {
    logger.info('resetting password');

    const { password, currentPassword } = payload;
    const userObj = await this.userModel.findById({ _id: user.id });

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      userObj.password,
    );

    if (!passwordMatches) {
      throw new BadRequestException(`Password is invalid`);
    }

    userObj.password = password;

    await userObj.save();

    return { message: 'Password reset was successfull' };
  }

  async getStats(logger: Logger): Promise<{
    totalJobs: {
      total: number;
      difference: number;
      trend: string;
    };
    activeJobs: {
      total: number;
      difference: number;
      trend: string;
    };
    hiredEmployees: {
      total: number;
      difference: number;
      trend: string;
    };
    pendingReviews: {
      total: number;
      difference: number;
      trend: string;
    };
  }> {
    logger.info('fetching dashboard stats');
    const stats = await this.fetchDashboardStats(logger);

    const response: {
      totalJobs: {
        total: number;
        difference: number;
        trend: string;
      };
      activeJobs: {
        total: number;
        difference: number;
        trend: string;
      };
      hiredEmployees: {
        total: number;
        difference: number;
        trend: string;
      };
      pendingReviews: {
        total: number;
        difference: number;
        trend: string;
      };
    } = {
      totalJobs: {
        total: stats.totalJobOpenings.thisWeek.length,
        difference:
          Math.abs(
            stats.totalJobOpenings.thisWeek.length -
              stats.totalJobOpenings.lastWeek.length,
          ) === stats.totalJobOpenings.thisWeek.length
            ? 0
            : Math.abs(
                stats.totalJobOpenings.thisWeek.length -
                  stats.totalJobOpenings.lastWeek.length,
              ),
        trend: this.getTrend(
          stats.totalJobOpenings.thisWeek.length,
          stats.totalJobOpenings.lastWeek.length,
        ),
      },
      activeJobs: {
        total: stats.totalActiveJobOpenings.thisWeek.length,
        difference:
          Math.abs(
            stats.totalActiveJobOpenings.thisWeek.length -
              stats.totalActiveJobOpenings.lastWeek.length,
          ) === stats.totalActiveJobOpenings.thisWeek.length
            ? 0
            : Math.abs(
                stats.totalActiveJobOpenings.thisWeek.length -
                  stats.totalActiveJobOpenings.lastWeek.length,
              ),
        trend: this.getTrend(
          stats.totalActiveJobOpenings.thisWeek.length,
          stats.totalActiveJobOpenings.lastWeek.length,
        ),
      },
      hiredEmployees: {
        total: stats.totalHiredEmployees.thisWeek.length,
        difference:
          Math.abs(
            stats.totalHiredEmployees.thisWeek.length -
              stats.totalHiredEmployees.lastWeek.length,
          ) === stats.totalHiredEmployees.thisWeek.length
            ? 0
            : Math.abs(
                stats.totalHiredEmployees.thisWeek.length -
                  stats.totalHiredEmployees.lastWeek.length,
              ),
        trend: this.getTrend(
          stats.totalHiredEmployees.thisWeek.length,
          stats.totalHiredEmployees.lastWeek.length,
        ),
      },
      pendingReviews: {
        total: stats.totalPendingReviews.thisWeek.length,
        difference:
          Math.abs(
            stats.totalPendingReviews.thisWeek.length -
              stats.totalPendingReviews.lastWeek.length,
          ) === stats.totalPendingReviews.thisWeek.length
            ? 0
            : Math.abs(
                stats.totalPendingReviews.thisWeek.length -
                  stats.totalPendingReviews.lastWeek.length,
              ),
        trend: this.getTrend(
          stats.totalPendingReviews.thisWeek.length,
          stats.totalPendingReviews.lastWeek.length,
        ),
      },
    };
    return response;
  }

  async fetchDashboardStats(logger: Logger): Promise<any> {
    logger.info('fetching dashboard stats');

    const { startDate } = this.utilService.getRangeToTimeline(RangeEnums.Week);

    const prevWeekStart = moment(startDate)
      .subtract(1, 'week')
      .startOf('week')
      .toDate();
    const prevWeekEnd = moment(startDate)
      .subtract(1, 'week')
      .endOf('week')
      .toDate();

    const { endDate: prevWeekED } = this.utilService.getRangeToTimeline(
      RangeEnums.Custom,
      prevWeekStart,
      prevWeekEnd,
    );

    const totalJobOpenings = await this.jobOpeningModel
      .find({
        isDeleted: { $ne: true },
      })
      .select('status createdAt');

    const totalJobOpeningsFromLastWeek = totalJobOpenings.filter(
      (job) => job.createdAt <= prevWeekED,
    );

    const totalActiveJobOpenings = totalJobOpenings.filter(
      (job) => job.status === JobOpeningStatus.Active,
    );
    const totalActiveJobOpeningsFromLastWeek = totalJobOpenings.filter(
      (job) =>
        job.createdAt <= prevWeekED && job.status === JobOpeningStatus.Active,
    );

    const totalJobApplications = await this.jobApplicationModel
      .find({
        isDeleted: { $ne: true },
      })
      .select('status agendas')
      .populate('agendas');

    const totalOffers = await this.offerModel.find().select('status createdAt');

    const totalHiredEmployees = totalOffers.filter(
      (offer) => offer.status === OfferStatus.Confirmed,
    );
    const totalHiredEmployeesFromLastWeek = totalOffers.filter(
      (offer) =>
        offer.createdAt <= prevWeekED && offer.status === OfferStatus.Confirmed,
    );

    const reviewsFromThisWeek = totalJobApplications.filter(
      (job) => job.status === JobApplicationStatus.Active,
    );
    const reviewsFromLastWeek = totalJobApplications.filter(
      (job) => job.createdAt <= prevWeekED,
    );

    const totalPendingReviews = reviewsFromThisWeek.map((rev) =>
      rev.agendas.filter(
        (agenda) =>
          agenda.status === AgendaStatus.Active &&
          agenda.type === AgendaType.CV,
      ),
    );
    const totalPendingReviewsFromLastWeek = reviewsFromLastWeek.map((rev) =>
      rev.agendas.filter(
        (agenda) =>
          agenda.status === AgendaStatus.Active &&
          agenda.type === AgendaType.CV,
      ),
    );

    return {
      totalJobOpenings: {
        thisWeek: totalJobOpenings,
        lastWeek: totalJobOpeningsFromLastWeek,
      },
      totalActiveJobOpenings: {
        thisWeek: totalActiveJobOpenings,
        lastWeek: totalActiveJobOpeningsFromLastWeek,
      },
      totalHiredEmployees: {
        thisWeek: totalHiredEmployees,
        lastWeek: totalHiredEmployeesFromLastWeek,
      },
      totalPendingReviews: {
        thisWeek: totalPendingReviews,
        lastWeek: totalPendingReviewsFromLastWeek,
      },
    };
  }

  async fetchJobEngagementOverview(logger: Logger): Promise<{
    jobsRead: {
      thisYear: any;
      prevYear: any;
    };
    jobsApplied: {
      thisYear: any;
      prevYear: any;
    };
  }> {
    logger.info('fetching job engagement overview');
    const { startDate } = this.utilService.getRangeToTimeline(RangeEnums.Year);

    const currentYearStart = moment(startDate).startOf('year').toDate();
    const currentYearEnd = moment(startDate).endOf('year').toDate();

    const prevYearStart = moment(startDate)
      .subtract(1, 'year')
      .startOf('year')
      .toDate();
    const prevYearEnd = moment(startDate)
      .subtract(1, 'year')
      .endOf('year')
      .toDate();

    const jobOpenings = await this.jobOpeningModel
      .find({
        isDeleted: { $ne: true },
        reads: { $exists: true },
      })
      .select('createdAt reads');

    const jobApplications = await this.jobApplicationModel
      .find()
      .select('createdAt job');

    const jobApplicationsThisYear = jobApplications.filter(
      (application) =>
        application.createdAt <= currentYearEnd &&
        application.createdAt >= currentYearStart,
    );
    const jobApplicationsPrevYear = jobApplications.filter(
      (application) =>
        application.createdAt <= prevYearEnd &&
        application.createdAt >= prevYearStart,
    );

    const jobsReadThisYear: any = {};
    jobOpenings.map((opening) =>
      opening.reads?.filter((read) => {
        if (read <= currentYearEnd && read >= currentYearStart) {
          const month = moment(read).format('MMMM');
          const key = `${month}`;
          jobsReadThisYear[key] = (jobsReadThisYear[key] || 0) + 1;
        }
        return read <= currentYearEnd && read >= currentYearStart;
      }),
    );

    const jobsReadPrevYear: any = {};
    jobOpenings.map((opening) =>
      opening.reads?.filter((read) => {
        if (read <= prevYearEnd && read >= prevYearStart) {
          const month = moment(read).format('MMMM');
          const key = `${month}`;
          jobsReadPrevYear[key] = (jobsReadPrevYear[key] || 0) + 1;
        }
        return read <= prevYearEnd && read >= prevYearStart;
      }),
    );

    const jobsAppliedThisYear = jobApplicationsThisYear.reduce((acc, curr) => {
      const month = moment(curr.createdAt).format('MMMM');
      const key = `${month}`;
      acc[key] = (acc[key] || 0) + 1;

      return acc;
    }, {});

    const jobsAppliedPrevYear = jobApplicationsPrevYear.reduce((acc, curr) => {
      const month = moment(curr.createdAt).format('MMMM');
      const key = `${month}`;
      acc[key] = (acc[key] || 0) + 1;

      return acc;
    }, {});

    const [
      formattedJobsReadThisYear,
      formattedJobsReadPrevYear,
      formattedJobsAppliedThisYear,
      formattedJobsAppliedPrevYear,
    ] = await Promise.all([
      this.formatJobEngagementResponse(jobsReadThisYear),
      this.formatJobEngagementResponse(jobsReadPrevYear),
      this.formatJobEngagementResponse(jobsAppliedThisYear),
      this.formatJobEngagementResponse(jobsAppliedPrevYear),
    ]);

    return {
      jobsRead: {
        thisYear: formattedJobsReadThisYear,
        prevYear: formattedJobsReadPrevYear,
      },
      jobsApplied: {
        thisYear: formattedJobsAppliedThisYear,
        prevYear: formattedJobsAppliedPrevYear,
      },
    };
  }

  async formatJobEngagementResponse(response: any): Promise<any> {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return Array.from({ length: 12 }, (_, i) => ({
      month: months[i],
      value: response[months[i]] || 0,
    }));
  }

  async uploadFile(fileUploadDTO: FileUploadDTO) {
    const { data, folder = '', filename = '' } = fileUploadDTO;
    const [mime, base64] = data.split('data:').pop().split(';base64,');
    return this.utilService.uploadFile(mime, base64, folder, filename);
  }

  private getTrend(current: number, previous: number): string {
    if (current > previous) return 'up';
    if (current === previous) return 'stable';
    return 'down';
  }
}
