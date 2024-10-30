"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const account_controller_1 = require("./account.controller");
const account_service_1 = require("./account.service");
const user_module_1 = require("../user/user.module");
const jwt_1 = require("@nestjs/jwt");
const configuration_1 = require("../config/env/configuration");
const jwt_strategy_1 = require("./jwt.strategy");
const local_strategy_1 = require("./local.strategy");
const mongoose_1 = require("@nestjs/mongoose");
const schema_constants_1 = require("../constants/schema_constants");
const user_schema_1 = require("../user/schemas/user.schema");
const schemas_1 = require("../job/schemas");
const job_application_schema_1 = require("../job/schemas/job-application.schema");
const offer_schema_1 = require("../offer/schemas/offer.schema");
const auditlog_module_1 = require("../auditlog/auditlog.module");
let AccountModule = class AccountModule {
};
exports.AccountModule = AccountModule;
exports.AccountModule = AccountModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: schema_constants_1.USER, schema: user_schema_1.UserSchema },
                { name: schema_constants_1.JOB_OPENING, schema: schemas_1.JobOpeningSchema },
                { name: schema_constants_1.JOB_APPLICATION, schema: job_application_schema_1.JobApplicationSchema },
                { name: schema_constants_1.OFFER, schema: offer_schema_1.OfferSchema },
            ]),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: (0, configuration_1.default)().jwt.secret,
                    signOptions: { expiresIn: (0, configuration_1.default)().jwt.expiresIn },
                }),
            }),
            auditlog_module_1.AuditLogModule,
        ],
        controllers: [account_controller_1.AccountController],
        providers: [local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, account_service_1.AccountService],
    })
], AccountModule);
//# sourceMappingURL=account.module.js.map