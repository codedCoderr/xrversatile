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
exports.JobController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const response_service_1 = require("../util/response.service");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const winston_1 = require("winston");
const lodash_1 = require("lodash");
const decorators_1 = require("../shared/decorators");
const job_service_1 = require("./job.service");
const job_opening_dtos_1 = require("./dto/job_opening_dtos");
const types_1 = require("./types");
let JobController = class JobController {
    constructor(logger, jobService, responseService) {
        this.jobService = jobService;
        this.responseService = responseService;
        this.logger = logger.child({
            context: {
                service: 'JobController',
                module: 'Job',
            },
        });
    }
    async create(body, res, currentUser) {
        try {
            const user = (0, lodash_1.clone)(currentUser);
            const payload = await this.jobService.createJob(body, user, this.logger);
            if ((0, lodash_1.isEmpty)(payload)) {
                throw new Error('Failed to create job opening');
            }
            return this.responseService.json(res, 200, 'Job created successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue creating job: ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async list(res, input) {
        try {
            let message;
            const { perPage, page, status, search } = input;
            const payload = await this.jobService.fetchJobOpenings(search, status, page, perPage);
            message = 'Job openings fetched successfully';
            if ((0, lodash_1.isEmpty)(payload.data.jobs)) {
                message = 'No Job Found';
            }
            return this.responseService.json(res, 200, message, payload.data, payload.metadata);
        }
        catch (e) {
            this.logger.error(`issue retrieving job opening records ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async listPublic(res, input) {
        try {
            let message;
            const { perPage, page, search } = input;
            const payload = await this.jobService.fetchJobOpenings(search, undefined, page, perPage);
            message = 'Job openings fetched successfully';
            if ((0, lodash_1.isEmpty)(payload.data.jobs)) {
                message = 'No Job Found';
            }
            return this.responseService.json(res, 200, message, payload.data, payload.metadata);
        }
        catch (e) {
            this.logger.error(`issue retrieving job opening records ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async update(res, param, currentUser, updates) {
        const jobID = param.id;
        try {
            const user = (0, lodash_1.clone)(currentUser);
            const payload = await this.jobService.updateJob(jobID, user, updates, this.logger);
            return this.responseService.json(res, 200, 'Successfully updated job', payload);
        }
        catch (e) {
            this.logger.error(`issue updating job ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async changeStatus(req, param, body, res, currentUser) {
        try {
            const { id } = param;
            const user = (0, lodash_1.clone)(currentUser);
            const payload = await this.jobService.updateJobStaus(user, id, body.status, this.logger);
            return this.responseService.json(res, 200, `Job ${body.status === types_1.JobOpeningStatus.Active ? 'Resumed' : 'Paused'} Successfully`, payload);
        }
        catch (e) {
            this.logger.error(`issue upating job status: ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async delete(res, param, currentUser) {
        const jobID = param.id;
        try {
            const user = (0, lodash_1.clone)(currentUser);
            await this.jobService.deleteJob(user, jobID, this.logger);
            return this.responseService.json(res, 204, 'Successfully deleted Job');
        }
        catch (e) {
            this.logger.error(`issue deleting job ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async listApplications(res, id, query) {
        try {
            const payload = await this.jobService.fetchJobApplications(id, query.search);
            return this.responseService.json(res, 200, 'Job opening applications fetched successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue retrieving job opening application records ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async fetchJob(param, res) {
        try {
            const payload = await this.jobService.fetchJobById(param.id);
            return this.responseService.json(res, 200, 'Job Fetched Successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue fetching job: ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async fetchJobPublic(param, res) {
        try {
            const payload = await this.jobService.fetchJobById(param.id, true);
            return this.responseService.json(res, 200, 'Job Fetched Successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue fetching job: ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
};
exports.JobController = JobController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_opening_dtos_1.JobOpeningDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('list-public'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "listPublic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/:id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, job_opening_dtos_1.UpdateJobOpeningStatusDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/:id/delete'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/:id/applications'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "listApplications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/:id/details'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "fetchJob", null);
__decorate([
    (0, common_1.Get)('/:id/details-public'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "fetchJobPublic", null);
exports.JobController = JobController = __decorate([
    (0, common_1.Controller)('job'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        job_service_1.JobService,
        response_service_1.ResponseService])
], JobController);
//# sourceMappingURL=job.controller.js.map