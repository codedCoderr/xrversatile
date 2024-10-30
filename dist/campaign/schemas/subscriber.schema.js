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
exports.SubscriberSchema = exports.Subscriber = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const base_schema_decorator_1 = require("../../shared/decorators/base_schema.decorator");
const base_interface_1 = require("../../shared/interfaces/base.interface");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
let Subscriber = class Subscriber extends base_interface_1.BaseSchemaInterface {
};
exports.Subscriber = Subscriber;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.String,
        required: true,
        unique: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Subscriber.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Subscriber.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.Date,
    }),
    __metadata("design:type", Date)
], Subscriber.prototype, "deletedAt", void 0);
exports.Subscriber = Subscriber = __decorate([
    (0, base_schema_decorator_1.BaseSchemaDecorator)({
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
                delete ret.__v;
            },
        },
    })
], Subscriber);
const SubscriberSchema = mongoose_1.SchemaFactory.createForClass(Subscriber);
exports.SubscriberSchema = SubscriberSchema;
SubscriberSchema.index({
    email: 1,
});
//# sourceMappingURL=subscriber.schema.js.map