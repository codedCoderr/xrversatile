"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferSchema = exports.CurrencyAmountSchema = void 0;
const mongoose_1 = require("mongoose");
const index_1 = require("../../constants/index");
const offer_interface_1 = require("../interfaces/offer.interface");
exports.CurrencyAmountSchema = new mongoose_1.Schema({
    value: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
}, { _id: false });
exports.OfferSchema = new mongoose_1.Schema({
    subject: {
        type: String,
    },
    content: {
        type: String,
    },
    application: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: index_1.SCHEMAS.JOB_APPLICATION,
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: index_1.SCHEMAS.JOB_OPENING,
    },
    sentBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: index_1.SCHEMAS.USER,
    },
    scriptSignUUID: {
        type: String,
    },
    documentUrl: {
        type: String,
    },
    salaryAmount: {
        type: exports.CurrencyAmountSchema,
    },
    resumptionDate: {
        type: String,
    },
    status: {
        type: String,
        enum: offer_interface_1.OfferStatuses,
    },
    cancelReason: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
        },
    },
});
//# sourceMappingURL=offer.schema.js.map