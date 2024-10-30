"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schema_constants_1 = require("../constants/schema_constants");
const uploader_module_1 = require("../uploader/uploader.module");
const offer_schema_1 = require("../offer/schemas/offer.schema");
const auditlog_module_1 = require("../auditlog/auditlog.module");
const offer_module_1 = require("../offer/offer.module");
const job_controller_1 = require("./job.controller");
const job_service_1 = require("./job.service");
const job_application_service_1 = require("./job_application.service");
const job_application_controller_1 = require("./job_application.controller");
const job_application_comment_controller_1 = require("./job_application_comment.controller");
const job_application_comment_service_1 = require("./job_application_comment.service");
const schemas_1 = require("./schemas");
let JobModule = class JobModule {
};
exports.JobModule = JobModule;
exports.JobModule = JobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: schema_constants_1.JOB_OPENING, schema: schemas_1.JobOpeningSchema },
                { name: schema_constants_1.JOB_APPLICATION, schema: schemas_1.JobApplicationSchema },
                { name: schema_constants_1.JOB_APPLICATION_AGENDA, schema: schemas_1.JobApplicationAgendaSchema },
                { name: schema_constants_1.JOB_APPLICATION_COMMENT, schema: schemas_1.JobApplicationCommentSchema },
                { name: schema_constants_1.OFFER, schema: offer_schema_1.OfferSchema },
            ]),
            uploader_module_1.UploaderModule,
            auditlog_module_1.AuditLogModule,
            offer_module_1.OfferModule,
        ],
        controllers: [
            job_controller_1.JobController,
            job_application_controller_1.JobApplicationController,
            job_application_comment_controller_1.JobApplicationCommentController,
        ],
        providers: [job_service_1.JobService, job_application_service_1.JobApplicationService, job_application_comment_service_1.JobApplicationCommentService],
        exports: [job_service_1.JobService, job_application_service_1.JobApplicationService, job_application_comment_service_1.JobApplicationCommentService],
    })
], JobModule);
//# sourceMappingURL=job.module.js.map