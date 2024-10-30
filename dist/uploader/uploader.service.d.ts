import { Logger } from 'winston';
import { Uploader } from './uploader.interface';
import { FileUploadDTO } from './dto';
import { UploadedResource } from './interfaces';
export declare class UploadService {
    private uploader;
    constructor(uploader: Uploader);
    getExtensionFromInput(input: FileUploadDTO): string;
    uploadCV(organizationName: string, jobID: string, input: FileUploadDTO, logger: Logger): Promise<UploadedResource>;
    uploadOfferDocument(jobID: string, input: FileUploadDTO, logger: Logger, isUpdate?: boolean): Promise<UploadedResource>;
}
