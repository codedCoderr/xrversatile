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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const base_schema_decorator_1 = require("../../shared/decorators/base_schema.decorator");
const base_interface_1 = require("../../shared/interfaces/base.interface");
const mongoose_2 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../dto/user.dto");
let User = class User extends base_interface_1.BaseSchemaInterface {
};
exports.User = User;
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        required: true,
        unique: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], User.prototype, "middleName", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
        required: true,
        default: user_dto_1.RoleEnum.Admin,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.String,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.Boolean,
        required: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.SchemaTypes.Date,
    }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
exports.User = User = __decorate([
    (0, base_schema_decorator_1.BaseSchemaDecorator)({
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
                delete ret.__v;
                delete ret.password;
            },
        },
    })
], User);
const UserSchema = mongoose_2.SchemaFactory.createForClass(User);
exports.UserSchema = UserSchema;
UserSchema.pre('save', function hashPassword(next) {
    if (!this.isModified('password')) {
        next();
        return;
    }
    const values = this;
    const hash = (0, bcryptjs_1.hashSync)(values.password, 8);
    values.password = hash;
    next();
});
//# sourceMappingURL=user.schema.js.map