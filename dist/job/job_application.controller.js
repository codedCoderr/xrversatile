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
exports.JobApplicationController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const winston_1 = require("winston");
const lodash_1 = require("lodash");
const dto_1 = require("../uploader/dto");
const response_service_1 = require("../util/response.service");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const decorators_1 = require("../shared/decorators");
const job_application_service_1 = require("./job_application.service");
const job_application_dtos_1 = require("./dto/job_application_dtos");
const types_1 = require("./types");
let JobApplicationController = class JobApplicationController {
    constructor(logger, jobApplicationService, responseService) {
        this.jobApplicationService = jobApplicationService;
        this.responseService = responseService;
        this.logger = logger.child({
            context: {
                service: 'JobApplicationController',
                module: 'Job',
            },
        });
    }
    async upload(res, jobId, body) {
        try {
            const payload = await this.jobApplicationService.createJobApplication(jobId, body, this.logger);
            return this.responseService.json(res, 200, 'Job application created successfully', payload);
        }
        catch (error) {
            this.logger.error(`issue creating job application from upload: ${error.message}`);
            if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
                const message = 'You have already applied for this Job';
                return this.responseService.json(res, 409, message);
            }
            return this.responseService.json(res, error);
        }
    }
    async moveToStage(res, jobApplicationID, body) {
        try {
            await this.jobApplicationService.moveToStage(jobApplicationID, body, this.logger);
            return this.responseService.json(res, 200, 'Job application agenda successfully moved');
        }
        catch (error) {
            this.logger.error(`issue moving job applications to stage: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async toggleApplicationStatus(currentUser, res, param, body) {
        const user = (0, lodash_1.clone)(currentUser);
        const { applicationID } = param;
        const { status } = body;
        let message;
        if (status === types_1.JobApplicationStatus.Rejected) {
            message = 'Successfully rejected job application';
        }
        else if (status === types_1.JobApplicationStatus.Active) {
            message = 'Successfully restored job application';
        }
        else {
            message = 'Successfully updated job application';
        }
        try {
            await this.jobApplicationService.toggleApplicationStatus(user, applicationID, body, this.logger);
            return this.responseService.json(res, 200, message);
        }
        catch (e) {
            this.logger.error(`issue updating job application status ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async cancelJobApplicationOffer(currentUser, res, param, input) {
        const user = (0, lodash_1.clone)(currentUser);
        const { applicationID } = param;
        try {
            await this.jobApplicationService.cancelApplicationOffer(user, applicationID, this.logger, input.reason);
            return this.responseService.json(res, 200, "Successfully cancelled job application's offer");
        }
        catch (e) {
            this.logger.error(`issue cancelling job application's offer ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
};
exports.JobApplicationController = JobApplicationController;
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.CVUploadDTO]),
    __metadata("design:returntype", Promise)
], JobApplicationController.prototype, "upload", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':applicationID/move'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('applicationID')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, job_application_dtos_1.JobApplicationAgendaMoveInput]),
    __metadata("design:returntype", Promise)
], JobApplicationController.prototype, "moveToStage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/:applicationID'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, job_application_dtos_1.ToggleApplicationStatusDTO]),
    __metadata("design:returntype", Promise)
], JobApplicationController.prototype, "toggleApplicationStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/:applicationID/cancel-offer'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], JobApplicationController.prototype, "cancelJobApplicationOffer", null);
exports.JobApplicationController = JobApplicationController = __decorate([
    (0, common_1.Controller)('job/:id/application'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        job_application_service_1.JobApplicationService,
        response_service_1.ResponseService])
], JobApplicationController);
//# sourceMappingURL=job_application.controller.js.map