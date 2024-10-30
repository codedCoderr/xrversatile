"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderModule = void 0;
const common_1 = require("@nestjs/common");
const configuration_1 = require("../config/env/configuration");
const index_1 = require("../constants/index");
const core_1 = require("@nestjs/core");
const uploader_service_1 = require("./uploader.service");
const mock_service_1 = require("./services/mock/mock.service");
const s3_service_1 = require("./services/s3/s3.service");
let UploaderModule = class UploaderModule {
};
exports.UploaderModule = UploaderModule;
exports.UploaderModule = UploaderModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: index_1.UPLOADER,
                useFactory: (logger, adapter) => {
                    if ((0, configuration_1.default)().enableMockUploader) {
                        logger.info('using mock uploader');
                        return new mock_service_1.MockService(logger, adapter);
                    }
                    logger.info('using aws s3 uploader');
                    return new s3_service_1.S3Service();
                },
                inject: [index_1.LOGGER, core_1.HttpAdapterHost],
            },
            uploader_service_1.UploadService,
        ],
        exports: [uploader_service_1.UploadService],
    })
], UploaderModule);
//# sourceMappingURL=uploader.module.js.map