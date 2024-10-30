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
exports.JobOpeningSchema = exports.JobOpening = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../constants");
const types_1 = require("../types");
const base_interface_1 = require("../../shared/interfaces/base.interface");
const mongoose_2 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const user_schema_1 = require("../../user/schemas/user.schema");
const base_schema_decorator_1 = require("../../shared/decorators/base_schema.decorator");
let JobOpening = class JobOpening extends base_interface_1.BaseSchemaInterface {
};
exports.JobOpening = JobOpening;
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JobOpening.prototype, "companyName", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JobOpening.prototype, "title", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    __metadata("design:type", String)
], JobOpening.prototype, "description", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        default: types_1.JobType.FullTime,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JobOpening.prototype, "category", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    __metadata("design:type", String)
], JobOpening.prototype, "location", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    __metadata("design:type", String)
], JobOpening.prototype, "requirements", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    __metadata("design:type", String)
], JobOpening.prototype, "responsibilities", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    __metadata("design:type", String)
], JobOpening.prototype, "benefits", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    __metadata("design:type", String)
], JobOpening.prototype, "duration", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.SCHEMAS.USER,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", user_schema_1.User)
], JobOpening.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        enum: types_1.JobOpeningStatuses,
        default: types_1.JobOpeningStatus.Active,
    }),
    __metadata("design:type", String)
], JobOpening.prototype, "status", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.Array,
    }),
    __metadata("design:type", Array)
], JobOpening.prototype, "reads", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.Array,
        default: [],
    }),
    __metadata("design:type", Array)
], JobOpening.prototype, "agendas", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], JobOpening.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    __metadata("design:type", Date)
], JobOpening.prototype, "deletedAt", void 0);
exports.JobOpening = JobOpening = __decorate([
    (0, base_schema_decorator_1.BaseSchemaDecorator)({
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
                delete ret.__v;
            },
        },
    })
], JobOpening);
const JobOpeningSchema = mongoose_2.SchemaFactory.createForClass(JobOpening);
exports.JobOpeningSchema = JobOpeningSchema;
//# sourceMappingURL=job-opening.schema.js.map