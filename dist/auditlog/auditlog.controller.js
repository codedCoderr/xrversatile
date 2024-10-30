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
exports.AuditLogController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const constants_1 = require("../constants");
const winston_service_1 = require("../logger/winston.service");
const util_1 = require("../util");
const auditlog_service_1 = require("./auditlog.service");
let AuditLogController = class AuditLogController {
    constructor(logger, auditLogService, responseService) {
        this.auditLogService = auditLogService;
        this.responseService = responseService;
        this.logger = logger.child({
            context: { service: 'AuditLogController', module: 'AuditLog' },
        });
    }
    async list(res, input) {
        try {
            const { perPage, page, search, doneBy, startDate, endDate } = input;
            const payload = await this.auditLogService.listAuditLogs(this.logger, search, doneBy, startDate, endDate, page, perPage);
            return this.responseService.json(res, 200, 'Audit logs fetched successfully', payload.data, payload.metadata);
        }
        catch (error) {
            this.logger.error(`issue fetching audit logs: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "list", null);
exports.AuditLogController = AuditLogController = __decorate([
    (0, common_1.Controller)('auditlog'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_service_1.default,
        auditlog_service_1.AuditLogService,
        util_1.ResponseService])
], AuditLogController);
//# sourceMappingURL=auditlog.controller.js.map