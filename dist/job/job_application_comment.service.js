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
exports.JobApplicationCommentService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const mongoose_1 = require("mongoose");
const winston_1 = require("winston");
const pagination_service_1 = require("../util/pagination.service");
const lodash_1 = require("lodash");
const mongoose_2 = require("@nestjs/mongoose");
const job_service_1 = require("./job.service");
const job_application_service_1 = require("./job_application.service");
let JobApplicationCommentService = class JobApplicationCommentService {
    constructor(logger, jobApplicationCommentModel, jobService, jobApplicationService, paginationService) {
        this.jobApplicationCommentModel = jobApplicationCommentModel;
        this.jobService = jobService;
        this.jobApplicationService = jobApplicationService;
        this.paginationService = paginationService;
        this.logger = logger.child({
            context: {
                service: 'JobApplicationCommentService',
                module: 'Job',
            },
        });
    }
    async createJobApplicationComment(user, applicationId, jobId, comment, logger) {
        logger.info(`creating comment for job application with id of ${applicationId}`);
        const jobApplication = await this.jobApplicationService.findApplicationById(applicationId, logger);
        if (!jobApplication) {
            throw new Error('Application does not exist');
        }
        const createdComment = await this.jobApplicationCommentModel.create(Object.assign(Object.assign({}, comment), { application: applicationId, sender: user, job: jobId }));
        return createdComment;
    }
    async fetchComments(application, jobId, page, perPage) {
        const job = await this.jobService.findOneJobByQuery({
            _id: jobId,
            isDeleted: { $ne: true },
        });
        if ((0, lodash_1.isEmpty)(job)) {
            throw new Error('Job does not exist');
        }
        const criteria = {
            application,
            isDeleted: false,
        };
        const populate = ['sender'];
        const comments = await this.paginationService.paginate(this.jobApplicationCommentModel, criteria, null, page, perPage, populate);
        return comments;
    }
    async deleteApplicationComment(commentId, user, logger) {
        logger.info(`deleting comment with id of ${commentId}`);
        const foundComment = await this.jobApplicationCommentModel.findOne({
            _id: commentId,
            isDeleted: { $ne: true },
        });
        if (foundComment.sender.toString() !== user.id.toString()) {
            throw new common_1.UnauthorizedException(`You cannot delete a comment you didn't create`);
        }
        foundComment.isDeleted = true;
        foundComment.deletedAt = new Date();
        foundComment.save();
    }
    async updateApplicationComment(commentId, user, input, logger) {
        logger.info(`updating comment with id of ${commentId}`);
        const foundComment = await this.jobApplicationCommentModel.findOne({
            _id: commentId,
            isDeleted: false,
        });
        if (foundComment.sender.toString() !== user.id.toString()) {
            throw new common_1.UnauthorizedException(`You cannot update a comment you didn't create`);
        }
        foundComment.content = input.content;
        foundComment.save();
        return this.jobApplicationCommentModel.findOne({
            _id: commentId,
            sender: user,
            isDeleted: false,
        });
    }
    async fetchApplicationComment(find, populate) {
        const chat = this.jobApplicationCommentModel.findOne(find);
        if (populate && populate.application) {
            chat.populate({
                path: 'application',
                model: constants_1.SCHEMAS.JOB_APPLICATION,
            });
        }
        if (populate && populate.job) {
            chat.populate({
                path: 'job',
                model: constants_1.SCHEMAS.JOB_OPENING,
            });
        }
        return chat.lean();
    }
};
exports.JobApplicationCommentService = JobApplicationCommentService;
exports.JobApplicationCommentService = JobApplicationCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __param(1, (0, mongoose_2.InjectModel)(constants_1.SCHEMAS.JOB_APPLICATION_COMMENT)),
    __metadata("design:paramtypes", [winston_1.Logger,
        mongoose_1.Model,
        job_service_1.JobService,
        job_application_service_1.JobApplicationService,
        pagination_service_1.PaginationService])
], JobApplicationCommentService);
//# sourceMappingURL=job_application_comment.service.js.map