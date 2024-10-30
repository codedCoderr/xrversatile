"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedResourceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UploadedResourceSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
    },
    bucket: {
        type: String,
    },
    mime: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
    },
}, { _id: false });
//# sourceMappingURL=uploader.schema.js.map