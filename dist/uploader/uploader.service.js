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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const mime_types_1 = require("mime-types");
const p = require("path");
const constants_1 = require("../constants");
let UploadService = class UploadService {
    constructor(uploader) {
        this.uploader = uploader;
    }
    getExtensionFromInput(input) {
        return (0, mime_types_1.extension)(input.mime) || p.extname(input.filename);
    }
    async uploadCV(organizationName, jobID, input, logger) {
        logger.info(`uploading ${input.filename} using ${this.uploader.name()}`);
        const extension = this.getExtensionFromInput(input);
        const currentTimestamp = new Date().getTime();
        const filename = `${encodeURI(p.parse(input.filename).name)}-${currentTimestamp}.${extension}`;
        logger.debug(`uploading with filename: ${filename}`);
        const path = `resumes/${organizationName}/${jobID}/${filename}`;
        const url = await this.uploader.upload(path, input.data, input);
        return {
            url,
            filename,
            mime: input.mime,
            size: input.size,
        };
    }
    async uploadOfferDocument(jobID, input, logger, isUpdate = false) {
        logger.info(`uploading ${input.filename} using ${this.uploader.name()}`);
        const extension = this.getExtensionFromInput(input);
        const currentTimestamp = new Date().getTime();
        const filename = isUpdate
            ? p.parse(input.filename).name
            : `${encodeURI(input.filename)}-${currentTimestamp}.${extension}`;
        const path = `offers/${jobID}/${filename}`;
        const url = await this.uploader.upload(path, input.data, input);
        logger.info(`done uploading file ${url}`);
        return {
            url,
            filename,
            mime: input.mime,
            size: input.size,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.UPLOADER)),
    __metadata("design:paramtypes", [Object])
], UploadService);
//# sourceMappingURL=uploader.service.js.map