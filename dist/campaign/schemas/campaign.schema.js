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
exports.CampaignSchema = exports.Campaign = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../../constants");
const base_schema_decorator_1 = require("../../shared/decorators/base_schema.decorator");
const base_interface_1 = require("../../shared/interfaces/base.interface");
const user_schema_1 = require("../../user/schemas/user.schema");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
let Campaign = class Campaign extends base_interface_1.BaseSchemaInterface {
};
exports.Campaign = Campaign;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Campaign.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Campaign.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.Date,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], Campaign.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.ObjectId,
        ref: constants_1.SCHEMAS.USER,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", user_schema_1.User)
], Campaign.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Campaign.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.Date,
    }),
    __metadata("design:type", Date)
], Campaign.prototype, "deletedAt", void 0);
exports.Campaign = Campaign = __decorate([
    (0, base_schema_decorator_1.BaseSchemaDecorator)({
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
                delete ret.__v;
            },
        },
    })
], Campaign);
const CampaignSchema = mongoose_1.SchemaFactory.createForClass(Campaign);
exports.CampaignSchema = CampaignSchema;
//# sourceMappingURL=campaign.schema.js.map