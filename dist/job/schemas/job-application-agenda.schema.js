"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationAgendaSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../constants");
const types_1 = require("../types");
exports.JobApplicationAgendaSchema = new mongoose_1.Schema({
    type: {
        type: String,
    },
    jobApplication: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.SCHEMAS.JOB_APPLICATION,
        required: true,
    },
    meeting: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.SCHEMAS.MEETING,
    },
    status: {
        type: String,
        enum: types_1.AgendaStatuses,
        default: types_1.AgendaStatus.Scheduled,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
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
//# sourceMappingURL=job-application-agenda.schema.js.map