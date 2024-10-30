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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schema_constants_1 = require("../constants/schema_constants");
const mongoose_2 = require("mongoose");
const pagination_service_1 = require("../util/pagination.service");
let AuditLogService = class AuditLogService {
    constructor(auditLogModel, paginationService) {
        this.auditLogModel = auditLogModel;
        this.paginationService = paginationService;
    }
    async listAuditLogs(logger, search, doneBy, startDate, endDate, page = 1, perPage = 10) {
        logger.info('fetching audit logs');
        const query = {
            isDeleted: { $ne: true },
        };
        if (doneBy) {
            query.doneBy = doneBy;
        }
        if (startDate) {
            query.createdAt = {
                $gte: startDate,
            };
        }
        if (endDate) {
            query.createdAt = Object.assign(Object.assign({}, query.createdAt), { $lte: endDate });
        }
        if (search) {
            query.message = {
                $regex: search,
                $options: 'i',
            };
        }
        const response = await this.paginationService.paginate(this.auditLogModel, query, 'message doneBy createdAt', page, perPage, ['doneBy'], [{ createdAt: -1 }]);
        return response;
    }
    async createAuditLog(user, message, logger, payload) {
        logger.info('creating audit log');
        return this.auditLogModel.create({
            doneBy: user.id,
            message,
            payload,
        });
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schema_constants_1.AUDIT_LOG)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        pagination_service_1.PaginationService])
], AuditLogService);
//# sourceMappingURL=auditlog.service.js.map