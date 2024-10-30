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
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../constants");
const mongoose_2 = require("mongoose");
const pagination_service_1 = require("../util/pagination.service");
const auditlog_service_1 = require("../auditlog/auditlog.service");
const types_1 = require("./types");
let JobService = class JobService {
    constructor(jobOpeningModel, offerModel, jobApplicationModel, jobApplicationAgendaModel, paginationService, auditLogService, connection) {
        this.jobOpeningModel = jobOpeningModel;
        this.offerModel = offerModel;
        this.jobApplicationModel = jobApplicationModel;
        this.jobApplicationAgendaModel = jobApplicationAgendaModel;
        this.paginationService = paginationService;
        this.auditLogService = auditLogService;
        this.connection = connection;
    }
    async createJob(jobDTO, user, logger) {
        logger.info('creating job opening');
        jobDTO.createdBy = user;
        jobDTO.agendas = [];
        jobDTO.agendas.unshift(types_1.AgendaType.CV);
        jobDTO.agendas.push(types_1.AgendaType.Interview);
        jobDTO.agendas.push(types_1.AgendaType.Offer);
        const createdJob = await this.jobOpeningModel.create(Object.assign({}, jobDTO));
        await this.auditLogService.createAuditLog(user, 'Created a job', logger, jobDTO);
        return {
            id: createdJob.id,
            title: createdJob.title,
        };
    }
    async fetchJobOpenings(search, status, page = 1, perPage = 10) {
        const match = {
            isDeleted: false,
        };
        if (status) {
            match.status = status;
        }
        if (!(0, lodash_1.isEmpty)(search)) {
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
            this.paginationService.paginate(this.jobOpeningModel, match, null, page, perPage),
        ]);
        const activeJobsCount = totalOrgJobs.filter((job) => job.status === types_1.JobOpeningStatus.Active).length;
        const closedJobsCount = totalOrgJobs.filter((job) => job.status === types_1.JobOpeningStatus.Closed).length;
        const { data, metadata } = paginated;
        if (!(data === null || data === void 0 ? void 0 : data.length)) {
            return {
                data: {
                    jobs: [],
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
                jobs: data,
                jobsCount: {
                    active: activeJobsCount,
                    closed: closedJobsCount,
                },
            },
            metadata,
        };
    }
    async updateJob(jobId, user, updates, logger) {
        logger.info(`updating job with id ${jobId}`);
        const existingJob = await this.jobOpeningModel.findOne({
            _id: jobId,
        });
        if (!existingJob) {
            throw new common_1.NotFoundException();
        }
        if (!(0, lodash_1.isEmpty)(updates.agendas)) {
            updates.agendas.unshift(types_1.AgendaType.CV);
            updates.agendas.push(types_1.AgendaType.Offer);
        }
        const updatedJob = await this.jobOpeningModel.findOneAndUpdate({
            _id: jobId,
        }, updates, { useFindAndModify: false, new: true });
        if ((0, lodash_1.isEmpty)(updatedJob)) {
            throw new Error(`Failed to update job id ${jobId}`);
        }
        await this.auditLogService.createAuditLog(user, 'Updated a job', logger, updates);
        return updatedJob;
    }
    async updateJobStaus(user, jobId, status, logger) {
        logger.info(`updating job status with id ${jobId}`);
        const jobOpeningPayload = {
            status,
        };
        if (status === types_1.JobOpeningStatus.Closed) {
            jobOpeningPayload.closedAt = new Date();
        }
        const updatedJob = await this.jobOpeningModel.findOneAndUpdate({ _id: jobId }, Object.assign({}, jobOpeningPayload), {
            useFindAndModify: false,
            new: true,
        });
        if (!updatedJob) {
            throw new Error('failed to update job status');
        }
        logger.info(`successfully updated job status, title ${updatedJob.title}`);
        await this.auditLogService.createAuditLog(user, `Updated a job's status`, logger, status);
        return updatedJob;
    }
    async deleteJob(user, jobID, logger) {
        logger.info(`deleting job with id ${jobID}`);
        await this.jobOpeningModel.findOneAndUpdate({ _id: jobID, isDeleted: { $ne: true } }, {
            isDeleted: true,
            deletedAt: new Date(),
        }, {
            useFindAndModify: false,
            new: true,
        });
        await this.auditLogService.createAuditLog(user, 'Deleted a job', logger);
    }
    async findOneJobByQuery(query) {
        return this.jobOpeningModel.findOne(query);
    }
    async fetchJobApplications(jobID, search) {
        const criteria = {
            job: new mongoose_2.Types.ObjectId(jobID),
            isDeleted: false,
        };
        if (!(0, lodash_1.isEmpty)(search)) {
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
                _id: new mongoose_2.Types.ObjectId(jobID),
                isDeleted: false,
            })
                .select('agendas'),
            this.jobApplicationModel.find(criteria),
        ]);
        const reformedData = (await Promise.all(jobApplications.map(async (record) => {
            const offer = await this.offerModel
                .findOne({
                application: record.id,
                job: record.job,
                isDeleted: false,
            })
                .select('documentUrl cancelReason content subject resumptionDate');
            const jobAppAgendas = [];
            await Promise.all(job === null || job === void 0 ? void 0 : job.agendas.map(async (ag) => {
                const updated = await this.jobApplicationAgendaModel
                    .findOneAndUpdate({
                    type: { $regex: ag, $options: 'i' },
                    jobApplication: record.id,
                }, {
                    type: ag,
                    title: ag,
                    jobApplication: record.id,
                }, {
                    new: true,
                    upsert: true,
                })
                    .populate([
                    {
                        path: 'meeting',
                    },
                ]);
                jobAppAgendas.push(Object.assign(Object.assign({}, updated.toJSON()), { offer }));
            }));
            return Object.assign(Object.assign({}, record.toJSON()), { agendas: jobAppAgendas, offer });
        })));
        const stageMap = {
            cv: 'cv',
            offer: 'offer',
        };
        const result = {
            rejected: [],
            cv: [],
            offer: [],
        };
        const cvAgendaIds = [];
        (job.agendas || []).forEach((agenda) => {
            const isAgendaInMap = agenda in result;
            if (!isAgendaInMap) {
                result[agenda] = [];
                stageMap[agenda] = agenda;
            }
        });
        reformedData.forEach((jobApp) => {
            var _a;
            if (jobApp.status === types_1.JobApplicationStatus.Rejected) {
                result.rejected.push(jobApp);
                return;
            }
            if (jobApp.status === types_1.JobApplicationStatus.OfferAccepted) {
                result.offer.push(jobApp);
                return;
            }
            if (jobApp.status === types_1.JobApplicationStatus.OfferCountered) {
                result.offer.push(jobApp);
                return;
            }
            const agendas = jobApp === null || jobApp === void 0 ? void 0 : jobApp.agendas;
            const activeAgenda = agendas.find((agend) => agend.status === types_1.AgendaStatus.Active);
            if (activeAgenda) {
                (_a = result[stageMap[activeAgenda.type]]) === null || _a === void 0 ? void 0 : _a.push(jobApp);
            }
            else if (jobApp.status !== types_1.JobApplicationStatus.OfferRejected) {
                result.cv.push(jobApp);
                const cvAgend = agendas.find((agend) => agend.type === types_1.AgendaType.CV);
                if (!(0, lodash_1.isEmpty)(cvAgend)) {
                    cvAgendaIds.push(cvAgend.id);
                }
            }
        });
        if (!(0, lodash_1.isEmpty)(cvAgendaIds)) {
            await this.jobApplicationAgendaModel.updateMany({
                _id: { $in: cvAgendaIds },
            }, { status: types_1.AgendaStatus.Active });
        }
        return result;
    }
    async fetchJobById(jobId, isPublic = false) {
        const $and = [{ _id: jobId }, { isDeleted: { $ne: true } }];
        const criteria = { $and };
        const job = await this.jobOpeningModel
            .findOne(criteria)
            .populate('createdBy');
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (isPublic) {
            job.reads.push(new Date());
            job.save();
        }
        return job;
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.JOB_OPENING)),
    __param(1, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.OFFER)),
    __param(2, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.JOB_APPLICATION)),
    __param(3, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.JOB_APPLICATION_AGENDA)),
    __param(6, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        pagination_service_1.PaginationService,
        auditlog_service_1.AuditLogService,
        mongoose_2.Connection])
], JobService);
//# sourceMappingURL=job.service.js.map