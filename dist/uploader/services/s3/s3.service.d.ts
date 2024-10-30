import { FileUpload } from '@src/uploader/interfaces';
import { Uploader } from '../../uploader.interface';
export declare class S3Service implements Uploader {
    private client;
    private bucket;
    constructor();
    name(): string;
    upload(filename: string, content: Buffer | string, upload: FileUpload): Promise<string>;
    delete(_filename: string): Promise<boolean>;
}
