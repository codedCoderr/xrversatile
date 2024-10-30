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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseService = exports.ResponseObject = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
class ResponseObject {
}
exports.ResponseObject = ResponseObject;
const defaultStatus = 400;
let ResponseService = class ResponseService {
    constructor(configService) {
        this.configService = configService;
    }
    json(res, statusOrError, message, data, meta, code) {
        const error = statusOrError instanceof Error ? statusOrError : null;
        const responseObj = {};
        responseObj.message = message;
        let status = statusOrError;
        if (error) {
            const errorObj = statusOrError;
            responseObj.message = message || errorObj.message;
            status = (0, lodash_1.get)(errorObj, 'status', defaultStatus);
        }
        if (!(0, lodash_1.isNil)(data)) {
            responseObj.data = data;
        }
        if (!(0, lodash_1.isNil)(meta)) {
            responseObj.meta = meta;
        }
        if (!(0, lodash_1.isEmpty)(code)) {
            responseObj.code = code;
        }
        const statusCode = status;
        res.status(statusCode).json(responseObj);
    }
    static statiJson(res, statusOrError, message, data, meta, code) {
        const error = statusOrError instanceof Error ? statusOrError : null;
        const responseObj = {};
        responseObj.message = message;
        let status = statusOrError;
        if (error) {
            const errorObj = statusOrError;
            responseObj.message = message || errorObj.message;
            status = (0, lodash_1.get)(errorObj, 'status', defaultStatus);
        }
        if (!(0, lodash_1.isNil)(data)) {
            responseObj.data = data;
        }
        if (!(0, lodash_1.isNil)(meta)) {
            responseObj.meta = meta;
        }
        if (!(0, lodash_1.isEmpty)(code)) {
            responseObj.code = code;
        }
        const statusCode = status;
        res.status(statusCode).json(responseObj);
    }
};
exports.ResponseService = ResponseService;
exports.ResponseService = ResponseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ResponseService);
//# sourceMappingURL=response.service.js.map