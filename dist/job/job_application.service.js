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
exports.JobApplicationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../constants");
const uploader_service_1 = require("../uploader/uploader.service");
const util_service_1 = require("../util/util.service");
const mongoose_2 = require("mongoose");
const lodash_1 = require("lodash");
const offer_service_1 = require("../offer/offer.service");
const types_1 = require("./types");
const job_service_1 = require("./job.service");
let JobApplicationService = class JobApplicationService {
    constructor(jobApplicationModel, jobApplicationAgendaModel, connection, jobService, offerService, uploadService, utilService) {
        this.jobApplicationModel = jobApplicationModel;
        this.jobApplicationAgendaModel = jobApplicationAgendaModel;
        this.connection = connection;
        this.jobService = jobService;
        this.offerService = offerService;
        this.uploadService = uploadService;
        this.utilService = utilService;
    }
    async createJobApplication(jobId, input, logger) {
        logger.info('creating job applications from uploads');
        try {
            const jobOpening = await this.jobService.findOneJobByQuery({
                _id: jobId,
                isDeleted: { $ne: true },
            });
            if ((0, lodash_1.isEmpty)(jobOpening)) {
                throw new Error('Invalid Job Opening Specified');
            }
            if (jobOpening.status === types_1.JobOpeningStatus.Closed) {
                throw new Error('Job Opening is unavailable');
            }
            const res = await this.utilService.convertFileUploadCVToPdf(jobOpening.companyName, jobOpening.id, input, logger);
            input.data = res.data;
            input.mime = res.mime;
            input.filename = res.filename;
            const application = await this.createJobApplicationFromParsedData(jobOpening, input, {
                name: `${input.firstname} ${input.lastname}`,
                email: input.email,
                phone: input.phonenumber,
            }, logger);
            return application;
        }
        catch (error) {
            logger.error(`issue creating job application: ${error.message}`);
            throw error;
        }
    }
    async createJobApplicationFromParsedData(jobOpening, upload, parsedData, log) {
        const logger = log.child({
            email: parsedData === null || parsedData === void 0 ? void 0 : parsedData.email,
            name: parsedData === null || parsedData === void 0 ? void 0 : parsedData.name,
        });
        logger.info(`starting db transaction to create job application email: ${parsedData === null || parsedData === void 0 ? void 0 : parsedData.email} name: ${parsedData.name} filename: ${upload.filename}`);
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const names = (0, lodash_1.words)(parsedData.name);
            const [firstname, lastname] = names;
            let [application] = await this.jobApplicationModel.create([
                {
                    firstname,
                    lastname,
                    email: parsedData === null || parsedData === void 0 ? void 0 : parsedData.email,
                    phonenumber: parsedData.phone,
                    job: new mongoose_2.Types.ObjectId(jobOpening.id),
                    agendas: [],
                    parsedData,
                },
            ], { session });
            logger.info('job application record created');
            application = await application.populate('job');
            const { agendas } = jobOpening;
            const applicationAgendas = await Promise.all(agendas.map(async (agenda) => {
                const applicationAgenda = {
                    type: agenda,
                    jobApplication: application.id,
                };
                if (agenda === types_1.AgendaType.CV) {
                    applicationAgenda.status = types_1.AgendaStatus.Active;
                    applicationAgenda.title = agenda;
                }
                else {
                    applicationAgenda.title = agenda;
                }
                return applicationAgenda;
            }));
            const createApplicationAgendas = await this.jobApplicationAgendaModel.create(applicationAgendas, {
                session,
            });
            logger.info('job application agendas created');
            application.agendas = createApplicationAgendas.map((applicationAgenda) => applicationAgenda._id);
            const resource = await this.uploadService.uploadCV(jobOpening.companyName, jobOpening.id, upload, logger);
            application.cvUrl = resource;
            await application.save();
            await session.commitTransaction();
            logger.info(`job application create session committed: ${application.id}`);
            return application;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
            logger.info(`session ended for job application upload`);
        }
    }
    async moveToStage(jobApplicationID, input, logger) {
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
        if ((0, lodash_1.isEmpty)(currentActiveAgenda) || (0, lodash_1.isEmpty)(newActiveAgenda)) {
            throw new Error('Invalid  Application Agenda');
        }
        currentActiveAgenda.status = types_1.AgendaStatus.Done;
        newActiveAgenda.status = types_1.AgendaStatus.Active;
        await Promise.all([currentActiveAgenda.save(), newActiveAgenda.save()]);
    }
    async findApplicationById(applicationId, logger) {
        logger.info(`finding job application with id ${applicationId}`);
        return this.jobApplicationModel
            .findOne({ _id: applicationId, isDeleted: false })
            .populate('job');
    }
    async toggleApplicationStatus(user, applicationId, input, logger) {
        const session = await this.connection.startSession();
        const { status, activeAgendaID } = input;
        logger.info(`toggle job application with id ${applicationId} by user ${user.id} to status ${status}`);
        session.startTransaction();
        const application = await this.jobApplicationModel
            .findOne({ _id: applicationId, isDeleted: false })
            .populate('job');
        let agenda;
        if (!application) {
            throw new Error('Job Application not found');
        }
        try {
            if (status === types_1.JobApplicationStatus.Active) {
                if (application.status !== types_1.JobApplicationStatus.Rejected) {
                    throw new Error('Unable to restore non rejected application');
                }
                if (activeAgendaID) {
                    agenda = await this.jobApplicationAgendaModel.findOne({
                        _id: activeAgendaID,
                        isDeleted: false,
                        jobApplication: applicationId,
                    });
                }
                application.status = types_1.JobApplicationStatus.Active;
                await application.save({ session });
                if (agenda) {
                    agenda.status = types_1.AgendaStatus.Active;
                    await agenda.save({ session });
                }
                else {
                    await this.jobApplicationAgendaModel.updateMany({
                        jobApplication: applicationId,
                    }, { status: types_1.AgendaStatus.Scheduled }, { session });
                    await this.jobApplicationAgendaModel.updateOne({
                        jobApplication: applicationId,
                        type: types_1.AgendaType.CV,
                    }, { status: types_1.AgendaStatus.Active }, { session });
                }
            }
            else {
                if (application.status === types_1.JobApplicationStatus.Rejected) {
                    throw new Error('Application already rejected');
                }
                application.status = types_1.JobApplicationStatus.Rejected;
                await application.save({ session });
                await this.jobApplicationAgendaModel.updateMany({
                    jobApplication: applicationId,
                }, { status: types_1.AgendaStatus.Done }, { session });
            }
            await session.commitTransaction();
        }
        catch (err) {
            await session.abortTransaction();
            throw err;
        }
        finally {
            await session.endSession();
        }
    }
    async setApplicationAgendaMeeeting(applicationAgendaId, meeting, logger, session) {
        logger.info('update job application agenda with meeting');
        await this.jobApplicationAgendaModel.findOneAndUpdate({
            _id: applicationAgendaId,
        }, { meeting }, {
            useFindAndModify: false,
            session,
            new: true,
        });
    }
    async cancelApplicationOffer(user, applicationID, logger, reason) {
        const session = await this.connection.startSession();
        logger.info(`Cancel offer  job application with id ${applicationID} by user ${user.id}`);
        session.startTransaction();
        const application = await this.findApplicationById(applicationID, logger);
        if (!application) {
            throw new Error('Job Application not found');
        }
        try {
            const offer = await this.offerService.findOfferByJobApplication(applicationID, logger);
            if (offer) {
                await this.offerService.cancelOffer(offer.id, logger, reason, session);
            }
            application.status = types_1.JobApplicationStatus.Rejected;
            await application.save({ session });
            await session.commitTransaction();
        }
        catch (err) {
            await session.abortTransaction();
            throw err;
        }
        finally {
            await session.endSession();
        }
    }
};
exports.JobApplicationService = JobApplicationService;
exports.JobApplicationService = JobApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.JOB_APPLICATION)),
    __param(1, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.JOB_APPLICATION_AGENDA)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        job_service_1.JobService,
        offer_service_1.OfferService,
        uploader_service_1.UploadService,
        util_service_1.UtilService])
], JobApplicationService);
//# sourceMappingURL=job_application.service.js.map