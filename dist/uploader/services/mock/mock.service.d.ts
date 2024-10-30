import { Logger } from 'winston';
import { HttpAdapterHost } from '@nestjs/core';
import { FileUpload } from '@src/uploader/interfaces';
import { Uploader } from '../../uploader.interface';
export declare class MockService implements Uploader {
    private logger;
    private adapterHost;
    private uploads;
    constructor(logger: Logger, adapterHost: HttpAdapterHost);
    name(): string;
    upload(filename: string, _content: Buffer | string, upload: FileUpload): Promise<string>;
    delete(_filename: string): Promise<boolean>;
}
