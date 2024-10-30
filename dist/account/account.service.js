"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const bcryptjs_1 = require("bcryptjs");
const class_validator_1 = require("class-validator");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const constants_1 = require("../constants");
const util_service_1 = require("../util/util.service");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const job_1 = require("../job");
const offer_interface_1 = require("../offer/interfaces/offer.interface");
const pagination_service_1 = require("../util/pagination.service");
const auditlog_service_1 = require("../auditlog/auditlog.service");
const dtos_1 = require("./dtos");
let AccountService = class AccountService {
    constructor(userModel, jobOpeningModel, jobApplicationModel, offerModel, jwtService, utilService, userService, paginationService, auditLogService) {
        this.userModel = userModel;
        this.jobOpeningModel = jobOpeningModel;
        this.jobApplicationModel = jobApplicationModel;
        this.offerModel = offerModel;
        this.jwtService = jwtService;
        this.utilService = utilService;
        this.userService = userService;
        this.paginationService = paginationService;
        this.auditLogService = auditLogService;
    }
    async createAdmin(body, createdBy, logger) {
        logger.info('creating admin');
        const password = this.utilService.generateRandom(8);
        try {
            const user = await this.userModel.create(Object.assign(Object.assign({}, body), { password }));
            await this.auditLogService.createAuditLog(createdBy, 'Created an admin', logger, Object.assign(Object.assign({}, body), { password }));
            return user;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('A duplicate record exists');
            }
            throw error;
        }
    }
    async login(user, logger) {
        logger.info('logging in user');
        const token = await this.jwtService.sign({
            id: user.id,
        });
        await this.auditLogService.createAuditLog(user, 'Logged in', logger);
        return { token };
    }
    async validateUser(username, password, logger) {
        logger.info('validating user');
        const user = await this.userService.findByEmail(username, logger);
        if ((0, class_validator_1.isEmpty)(user)) {
            return null;
        }
        const validPassword = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!validPassword) {
            return null;
        }
        return user;
    }
    async getLoggedInAdmin(user, logger) {
        logger.info('getting logged-in admin');
        return user;
    }
    async getAdmins(logger, page = 1, perPage = 10) {
        logger.info('fetching admins');
        const { data, metadata } = await this.paginationService.paginate(this.userModel, { isDeleted: { $ne: true } }, null, page, perPage, [{ createdAt: -1 }]);
        return { data, metadata };
    }
    async updateAdmin(user, adminId, payload, logger) {
        logger.info(`updating admin with id ${adminId}`);
        try {
            const updatedAdmin = await this.userModel.findOneAndUpdate({ _id: adminId }, Object.assign({}, payload), { new: true });
            await this.auditLogService.createAuditLog(user, `Updated an admin's details`, logger, payload);
            return updatedAdmin;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('A duplicate record exists');
            }
            throw error;
        }
    }
    async deleteAdmin(user, adminId, logger) {
        logger.info(`deleting admin with id ${adminId}`);
        await this.userModel.findOneAndUpdate({ _id: adminId, isDeleted: { $ne: true } }, {
            isDeleted: true,
            deletedAt: new Date(),
        }, {
            useFindAndModify: false,
            new: true,
        });
        await this.auditLogService.createAuditLog(user, 'Deleted an admin', logger);
    }
    async updateProfile(user, payload, logger) {
        logger.info('updating user profile');
        try {
            const updatedAdmin = await this.userModel.findOneAndUpdate({ _id: user.id }, Object.assign({}, payload), { new: true });
            await this.auditLogService.createAuditLog(user, `Updated an admin's details`, logger, payload);
            return updatedAdmin;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('A duplicate record exists');
            }
            throw error;
        }
    }
    async resetPassword(user, payload, logger) {
        logger.info('resetting password');
        const { password, currentPassword } = payload;
        const userObj = await this.userModel.findById({ _id: user.id });
        const passwordMatches = await bcrypt.compare(currentPassword, userObj.password);
        if (!passwordMatches) {
            throw new common_1.BadRequestException(`Password is invalid`);
        }
        userObj.password = password;
        await userObj.save();
        return { message: 'Password reset was successfull' };
    }
    async getStats(logger) {
        logger.info('fetching dashboard stats');
        const stats = await this.fetchDashboardStats(logger);
        const response = {
            totalJobs: {
                total: stats.totalJobOpenings.thisWeek.length,
                difference: Math.abs(stats.totalJobOpenings.thisWeek.length -
                    stats.totalJobOpenings.lastWeek.length) === stats.totalJobOpenings.thisWeek.length
                    ? 0
                    : Math.abs(stats.totalJobOpenings.thisWeek.length -
                        stats.totalJobOpenings.lastWeek.length),
                trend: this.getTrend(stats.totalJobOpenings.thisWeek.length, stats.totalJobOpenings.lastWeek.length),
            },
            activeJobs: {
                total: stats.totalActiveJobOpenings.thisWeek.length,
                difference: Math.abs(stats.totalActiveJobOpenings.thisWeek.length -
                    stats.totalActiveJobOpenings.lastWeek.length) === stats.totalActiveJobOpenings.thisWeek.length
                    ? 0
                    : Math.abs(stats.totalActiveJobOpenings.thisWeek.length -
                        stats.totalActiveJobOpenings.lastWeek.length),
                trend: this.getTrend(stats.totalActiveJobOpenings.thisWeek.length, stats.totalActiveJobOpenings.lastWeek.length),
            },
            hiredEmployees: {
                total: stats.totalHiredEmployees.thisWeek.length,
                difference: Math.abs(stats.totalHiredEmployees.thisWeek.length -
                    stats.totalHiredEmployees.lastWeek.length) === stats.totalHiredEmployees.thisWeek.length
                    ? 0
                    : Math.abs(stats.totalHiredEmployees.thisWeek.length -
                        stats.totalHiredEmployees.lastWeek.length),
                trend: this.getTrend(stats.totalHiredEmployees.thisWeek.length, stats.totalHiredEmployees.lastWeek.length),
            },
            pendingReviews: {
                total: stats.totalPendingReviews.thisWeek.length,
                difference: Math.abs(stats.totalPendingReviews.thisWeek.length -
                    stats.totalPendingReviews.lastWeek.length) === stats.totalPendingReviews.thisWeek.length
                    ? 0
                    : Math.abs(stats.totalPendingReviews.thisWeek.length -
                        stats.totalPendingReviews.lastWeek.length),
                trend: this.getTrend(stats.totalPendingReviews.thisWeek.length, stats.totalPendingReviews.lastWeek.length),
            },
        };
        return response;
    }
    async fetchDashboardStats(logger) {
        logger.info('fetching dashboard stats');
        const { startDate } = this.utilService.getRangeToTimeline(dtos_1.RangeEnums.Week);
        const prevWeekStart = moment(startDate)
            .subtract(1, 'week')
            .startOf('week')
            .toDate();
        const prevWeekEnd = moment(startDate)
            .subtract(1, 'week')
            .endOf('week')
            .toDate();
        const { endDate: prevWeekED } = this.utilService.getRangeToTimeline(dtos_1.RangeEnums.Custom, prevWeekStart, prevWeekEnd);
        const totalJobOpenings = await this.jobOpeningModel
            .find({
            isDeleted: { $ne: true },
        })
            .select('status createdAt');
        const totalJobOpeningsFromLastWeek = totalJobOpenings.filter((job) => job.createdAt <= prevWeekED);
        const totalActiveJobOpenings = totalJobOpenings.filter((job) => job.status === job_1.JobOpeningStatus.Active);
        const totalActiveJobOpeningsFromLastWeek = totalJobOpenings.filter((job) => job.createdAt <= prevWeekED && job.status === job_1.JobOpeningStatus.Active);
        const totalJobApplications = await this.jobApplicationModel
            .find({
            isDeleted: { $ne: true },
        })
            .select('status agendas')
            .populate('agendas');
        const totalOffers = await this.offerModel.find().select('status createdAt');
        const totalHiredEmployees = totalOffers.filter((offer) => offer.status === offer_interface_1.OfferStatus.Confirmed);
        const totalHiredEmployeesFromLastWeek = totalOffers.filter((offer) => offer.createdAt <= prevWeekED && offer.status === offer_interface_1.OfferStatus.Confirmed);
        const reviewsFromThisWeek = totalJobApplications.filter((job) => job.status === job_1.JobApplicationStatus.Active);
        const reviewsFromLastWeek = totalJobApplications.filter((job) => job.createdAt <= prevWeekED);
        const totalPendingReviews = reviewsFromThisWeek.map((rev) => rev.agendas.filter((agenda) => agenda.status === job_1.AgendaStatus.Active &&
            agenda.type === job_1.AgendaType.CV));
        const totalPendingReviewsFromLastWeek = reviewsFromLastWeek.map((rev) => rev.agendas.filter((agenda) => agenda.status === job_1.AgendaStatus.Active &&
            agenda.type === job_1.AgendaType.CV));
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
    async fetchJobEngagementOverview(logger) {
        logger.info('fetching job engagement overview');
        const { startDate } = this.utilService.getRangeToTimeline(dtos_1.RangeEnums.Year);
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
        const jobApplicationsThisYear = jobApplications.filter((application) => application.createdAt <= currentYearEnd &&
            application.createdAt >= currentYearStart);
        const jobApplicationsPrevYear = jobApplications.filter((application) => application.createdAt <= prevYearEnd &&
            application.createdAt >= prevYearStart);
        const jobsReadThisYear = {};
        jobOpenings.map((opening) => {
            var _a;
            return (_a = opening.reads) === null || _a === void 0 ? void 0 : _a.filter((read) => {
                if (read <= currentYearEnd && read >= currentYearStart) {
                    const month = moment(read).format('MMMM');
                    const key = `${month}`;
                    jobsReadThisYear[key] = (jobsReadThisYear[key] || 0) + 1;
                }
                return read <= currentYearEnd && read >= currentYearStart;
            });
        });
        const jobsReadPrevYear = {};
        jobOpenings.map((opening) => {
            var _a;
            return (_a = opening.reads) === null || _a === void 0 ? void 0 : _a.filter((read) => {
                if (read <= prevYearEnd && read >= prevYearStart) {
                    const month = moment(read).format('MMMM');
                    const key = `${month}`;
                    jobsReadPrevYear[key] = (jobsReadPrevYear[key] || 0) + 1;
                }
                return read <= prevYearEnd && read >= prevYearStart;
            });
        });
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
        const [formattedJobsReadThisYear, formattedJobsReadPrevYear, formattedJobsAppliedThisYear, formattedJobsAppliedPrevYear,] = await Promise.all([
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
    async formatJobEngagementResponse(response) {
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
    async uploadFile(fileUploadDTO) {
        const { data, folder = '', filename = '' } = fileUploadDTO;
        const [mime, base64] = data.split('data:').pop().split(';base64,');
        return this.utilService.uploadFile(mime, base64, folder, filename);
    }
    getTrend(current, previous) {
        if (current > previous)
            return 'up';
        if (current === previous)
            return 'stable';
        return 'down';
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(constants_1.SCHEMAS.USER)),
    __param(1, (0, mongoose_2.InjectModel)(constants_1.SCHEMAS.JOB_OPENING)),
    __param(2, (0, mongoose_2.InjectModel)(constants_1.SCHEMAS.JOB_APPLICATION)),
    __param(3, (0, mongoose_2.InjectModel)(constants_1.SCHEMAS.OFFER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        jwt_1.JwtService,
        util_service_1.UtilService,
        user_service_1.UserService,
        pagination_service_1.PaginationService,
        auditlog_service_1.AuditLogService])
], AccountService);
//# sourceMappingURL=account.service.js.map