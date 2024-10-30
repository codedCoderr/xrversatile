"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationCommentSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../constants");
exports.JobApplicationCommentSchema = new mongoose_1.Schema({
    application: {
        type: mongoose_1.Types.ObjectId,
        ref: constants_1.SCHEMAS.JOB_APPLICATION,
        required: true,
    },
    job: {
        type: mongoose_1.Types.ObjectId,
        ref: constants_1.SCHEMAS.JOB_OPENING,
        required: true,
    },
    sender: {
        type: mongoose_1.Types.ObjectId,
        ref: constants_1.SCHEMAS.USER,
        required: true,
    },
    content: {
        type: String,
        required: true,
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
exports.JobApplicationCommentSchema.index({
    application: 1,
    isDeleted: 1,
});
//# sourceMappingURL=application-comment.schema.js.map