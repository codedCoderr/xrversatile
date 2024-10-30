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
exports.AuditLogSchema = exports.AuditLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schema_constants_1 = require("../../constants/schema_constants");
const base_schema_decorator_1 = require("../../shared/decorators/base_schema.decorator");
const base_interface_1 = require("../../shared/interfaces/base.interface");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
let AuditLog = class AuditLog extends base_interface_1.BaseSchemaInterface {
};
exports.AuditLog = AuditLog;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.ObjectId,
        ref: schema_constants_1.USER,
        required: true,
        autopopulate: {
            select: 'email firstName lastName isDeleted',
            maxDepth: 1,
        },
    }),
    __metadata("design:type", Object)
], AuditLog.prototype, "doneBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], AuditLog.prototype, "payload", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, base_schema_decorator_1.BaseSchemaDecorator)()
], AuditLog);
const AuditLogSchema = mongoose_1.SchemaFactory.createForClass(AuditLog);
exports.AuditLogSchema = AuditLogSchema;
//# sourceMappingURL=audit.log.interface.js.map