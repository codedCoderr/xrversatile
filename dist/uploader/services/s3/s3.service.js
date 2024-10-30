"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const aws_sdk_1 = require("aws-sdk");
const configuration_1 = require("../../../config/env/configuration");
class S3Service {
    constructor() {
        const config = (0, configuration_1.default)().s3;
        this.client = new aws_sdk_1.S3({
            apiVersion: '2006-03-01',
            secretAccessKey: config.secretAccessKey,
            accessKeyId: config.accessKeyId,
            endpoint: config.endpoint,
            s3ForcePathStyle: (0, configuration_1.default)().isDev(),
        });
        this.bucket = config.bucket;
    }
    name() {
        return 'aws s3 uploader';
    }
    async upload(filename, content, upload) {
        let body = content;
        if (!Buffer.isBuffer(content)) {
            body = Buffer.from(content.split(';base64,').pop(), 'base64');
        }
        const params = {
            Bucket: this.bucket,
            Key: filename,
            Body: body,
            ACL: 'public-read',
            ContentType: upload === null || upload === void 0 ? void 0 : upload.mime,
        };
        const res = await this.client.upload(params).promise();
        return res.Location;
    }
    delete(_filename) {
        return Promise.reject(new Error('not supported'));
    }
}
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map