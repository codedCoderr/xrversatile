"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 4000,
    ui: {
        url: process.env.UI_URL || 'http://localhost:4001',
    },
    database: {
        url: process.env.DATABASE_HOST,
        payDbUrl: process.env.PAY_MAIN_DB_HOST,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    s3: {
        bucket: process.env.S3_BUCKET,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        endpoint: process.env.S3_ENDPOINT,
    },
    enableMockUploader: process.env.ENABLE_MOCK_UPLOADER === 'true',
    api2pdf: {
        apiKey: process.env.API2PDF_API_KEY,
    },
    isTest() {
        return process.env.NODE_ENV === 'test';
    },
    isDev() {
        return !['production', 'staging'].includes(process.env.NODE_ENV);
    },
    isStaging() {
        return process.env.NODE_ENV === 'staging';
    },
    cronEnabled() {
        return process.env.ENABLED_CRON === 'true';
    },
});
//# sourceMappingURL=configuration.js.map