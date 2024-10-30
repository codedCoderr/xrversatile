export interface Configuration {
  env: string;
  port: number;
  ui: {
    url: string;
  };
  database: {
    url: string;
    payDbUrl: string;
  };
  jwt: {
    secret: string;
    expiresIn: string | number;
  };
  s3: {
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
  };
  enableMockUploader: boolean;
  api2pdf: {
    apiKey: string;
  };
  isTest(): boolean;
  isDev(): boolean;
  isStaging(): boolean;
  cronEnabled(): boolean;
}

export default (): Configuration => ({
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
  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  },
  isDev(): boolean {
    return !['production', 'staging'].includes(process.env.NODE_ENV);
  },
  isStaging(): boolean {
    return process.env.NODE_ENV === 'staging';
  },
  cronEnabled(): boolean {
    return process.env.ENABLED_CRON === 'true';
  },
});
