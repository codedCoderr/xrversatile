"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogModule = void 0;
const common_1 = require("@nestjs/common");
const auditlog_controller_1 = require("./auditlog.controller");
const mongoose_1 = require("@nestjs/mongoose");
const audit_log_interface_1 = require("./interfaces/audit.log.interface");
const schema_constants_1 = require("../constants/schema_constants");
const auditlog_service_1 = require("./auditlog.service");
let AuditLogModule = class AuditLogModule {
};
exports.AuditLogModule = AuditLogModule;
exports.AuditLogModule = AuditLogModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: schema_constants_1.AUDIT_LOG, schema: audit_log_interface_1.AuditLogSchema }]),
        ],
        exports: [auditlog_service_1.AuditLogService],
        controllers: [auditlog_controller_1.AuditLogController],
        providers: [auditlog_service_1.AuditLogService],
    })
], AuditLogModule);
//# sourceMappingURL=auditlog.module.js.map