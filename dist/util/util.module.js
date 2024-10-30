"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilModule = void 0;
const common_1 = require("@nestjs/common");
const Api2Pdf = require("api2pdf");
const constants_1 = require("../constants");
const uploader_module_1 = require("../uploader/uploader.module");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const configuration_1 = require("../config/env/configuration");
const util_service_1 = require("./util.service");
const response_service_1 = require("./response.service");
const pagination_service_1 = require("./pagination.service");
let UtilModule = class UtilModule {
};
exports.UtilModule = UtilModule;
exports.UtilModule = UtilModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            (0, common_1.forwardRef)(() => uploader_module_1.UploaderModule),
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: (0, configuration_1.default)().jwt.secret,
                    signOptions: { expiresIn: (0, configuration_1.default)().jwt.expiresIn },
                }),
            }),
        ],
        providers: [
            {
                provide: constants_1.PDF_GENERATOR,
                useFactory: () => new Api2Pdf((0, configuration_1.default)().api2pdf.apiKey),
            },
            util_service_1.UtilService,
            response_service_1.ResponseService,
            pagination_service_1.PaginationService,
        ],
        exports: [util_service_1.UtilService, response_service_1.ResponseService, pagination_service_1.PaginationService],
    })
], UtilModule);
//# sourceMappingURL=util.module.js.map