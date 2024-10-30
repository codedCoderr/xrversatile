"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const configuration_1 = require("./config/env/configuration");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const logger_module_1 = require("./logger/logger.module");
const util_module_1 = require("./util/util.module");
const account_module_1 = require("./account/account.module");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const job_module_1 = require("./job/job.module");
const uploader_module_1 = require("./uploader/uploader.module");
const meeting_module_1 = require("./meeting/meeting.module");
const campaign_module_1 = require("./campaign/campaign.module");
const offer_module_1 = require("./offer/offer.module");
const consultation_module_1 = require("./consultation/consultation.module");
const auditlog_module_1 = require("./auditlog/auditlog.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                ignoreEnvFile: (0, configuration_1.default)().isTest(),
                load: [configuration_1.default],
            }),
            schedule_1.ScheduleModule.forRoot(),
            {
                module: logger_module_1.LoggerModule,
                global: true,
            },
            mongoose_1.MongooseModule.forRoot((0, configuration_1.default)().database.url),
            user_module_1.UserModule,
            util_module_1.UtilModule,
            account_module_1.AccountModule,
            job_module_1.JobModule,
            uploader_module_1.UploaderModule,
            meeting_module_1.MeetingModule,
            campaign_module_1.CampaignModule,
            offer_module_1.OfferModule,
            consultation_module_1.ConsultationModule,
            auditlog_module_1.AuditLogModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [user_module_1.UserModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map