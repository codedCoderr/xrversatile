export declare class UploadedResourceDTO {
    url: string;
    filename: string;
    bucket: string;
    size: number;
    type: string;
}
export declare class FileUploadDTO {
    filename: string;
    size?: number;
    mime: string;
    data?: string;
    url?: string;
    folder?: string;
}
export declare class CVUploadDTO extends FileUploadDTO {
    firstname?: string;
    lastname?: string;
    email?: string;
    phonenumber: string;
}
