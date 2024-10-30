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
exports.JobApplicationCommentController = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
const response_service_1 = require("../util/response.service");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const decorators_1 = require("../shared/decorators");
const job_application_comment_dto_1 = require("./dto/job_application_comment_dto");
const job_application_comment_service_1 = require("./job_application_comment.service");
let JobApplicationCommentController = class JobApplicationCommentController {
    constructor(logger, jobApplicationCommentService, responseService) {
        this.jobApplicationCommentService = jobApplicationCommentService;
        this.responseService = responseService;
        this.logger = logger.child({
            context: {
                service: 'JobApplicationCommentController',
                module: 'Job',
            },
        });
    }
    async list(res, query, params) {
        const { perPage, page } = query;
        try {
            let message;
            const payload = await this.jobApplicationCommentService.fetchComments(params.appId, params.jobId, page, perPage);
            message = 'Comments fetched';
            if ((0, lodash_1.isEmpty)(payload.data)) {
                message = 'No comments found';
            }
            return this.responseService.json(res, 200, message, payload.data, payload.metadata);
        }
        catch (e) {
            this.logger.error(`issue retrieving job application comments ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async create(currentUser, res, application, job, input) {
        const user = (0, lodash_1.clone)(currentUser);
        try {
            const applicationComment = await this.jobApplicationCommentService.createJobApplicationComment(user, application, job, input, this.logger);
            return this.responseService.json(res, 200, 'Job application comment created successfully', applicationComment);
        }
        catch (error) {
            this.logger.error(`issue creating a job application comment : ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async delete(currentUser, res, comment) {
        const user = (0, lodash_1.clone)(currentUser);
        try {
            await this.jobApplicationCommentService.deleteApplicationComment(comment, user, this.logger);
            return this.responseService.json(res, 204, 'Job application comment deleted successfully');
        }
        catch (error) {
            this.logger.error(`issue deleting comment : ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async update(currentUser, res, comment, input) {
        const user = (0, lodash_1.clone)(currentUser);
        try {
            const applicationComment = await this.jobApplicationCommentService.updateApplicationComment(comment, user, input, this.logger);
            return this.responseService.json(res, 200, 'Job application comment updated successfully', applicationComment);
        }
        catch (error) {
            this.logger.error(`issue updating a comment : ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
};
exports.JobApplicationCommentController = JobApplicationCommentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], JobApplicationCommentController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('appId')),
    __param(3, (0, common_1.Param)('jobId')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, job_application_comment_dto_1.JobApplicationCommentDTO]),
    __metadata("design:returntype", Promise)
], JobApplicationCommentController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('delete/:commentId'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], JobApplicationCommentController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('update/:commentId'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('commentId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, job_application_comment_dto_1.JobApplicationCommentDTO]),
    __metadata("design:returntype", Promise)
], JobApplicationCommentController.prototype, "update", null);
exports.JobApplicationCommentController = JobApplicationCommentController = __decorate([
    (0, common_1.Controller)('job/:jobId/application/:appId/comment'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        job_application_comment_service_1.JobApplicationCommentService,
        response_service_1.ResponseService])
], JobApplicationCommentController);
//# sourceMappingURL=job_application_comment.controller.js.map