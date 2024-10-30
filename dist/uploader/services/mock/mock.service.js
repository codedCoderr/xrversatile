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
exports.MockService = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const constants_1 = require("../../../constants");
const core_1 = require("@nestjs/core");
const configuration_1 = require("../../../config/env/configuration");
let MockService = class MockService {
    constructor(logger, adapterHost) {
        var _a, _b;
        this.logger = logger;
        this.adapterHost = adapterHost;
        this.uploads = {};
        (_b = (_a = this.adapterHost) === null || _a === void 0 ? void 0 : _a.httpAdapter) === null || _b === void 0 ? void 0 : _b.get('/mocks/*', (req, res) => {
            const file = req.url.split('/mocks/').pop();
            const upload = this.uploads[file];
            if (!upload) {
                res.status(404).end();
                return;
            }
            const buf = Buffer.from(upload.data.split(';base64,').pop(), 'base64');
            res.setHeader('Content-Type', upload.mime);
            res.send(buf);
        });
        this.logger.info('mock upload route added');
    }
    name() {
        return 'mock uploader';
    }
    async upload(filename, _content, upload) {
        this.logger.info(`uploading ${filename} to the mock cloud`);
        this.uploads[filename] = upload;
        const { port } = (0, configuration_1.default)();
        const url = filename.includes('doc') || filename.includes('docx')
            ? 'https://production-peoplehrm.s3.us-west-2.amazonaws.com/resumes/5f2ba853350c4396c81b9a75/60426085ab1b5cb45afd290c/Ogechi%2520Ugochukwu%27s%2520CV-2-1615974192474.docx'
            : `http://localhost:${port}/mocks/${filename}`;
        this.logger.info(`resource url: ${url}`);
        return url;
    }
    delete(_filename) {
        return Promise.reject(new Error('not supported'));
    }
};
exports.MockService = MockService;
exports.MockService = MockService = __decorate([
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        core_1.HttpAdapterHost])
], MockService);
//# sourceMappingURL=mock.service.js.map