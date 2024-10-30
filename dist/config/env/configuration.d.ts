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
declare const _default: () => Configuration;
export default _default;
