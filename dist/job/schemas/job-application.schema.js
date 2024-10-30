"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../constants");
const uploader_schema_1 = require("../../uploader/uploader.schema");
const types_1 = require("../types");
exports.JobApplicationSchema = new mongoose_1.Schema({
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.SCHEMAS.JOB_OPENING,
        required: true,
        index: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    middlename: {
        type: String,
    },
    email: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    status: {
        type: String,
        enum: types_1.JobApplicationStatuses,
        default: types_1.JobApplicationStatus.Active,
    },
    cvUrl: {
        type: uploader_schema_1.UploadedResourceSchema,
    },
    coverLetter: {
        type: String,
    },
    agendas: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: constants_1.SCHEMAS.JOB_APPLICATION_AGENDA,
        },
    ],
    parsedData: {
        type: Object,
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
exports.JobApplicationSchema.index({ job: 1, phonenumber: 1 }, { unique: true });
//# sourceMappingURL=job-application.schema.js.map