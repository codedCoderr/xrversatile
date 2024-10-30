export interface UploadedResource {
    url: string;
    filename: string;
    bucket?: string;
    size?: number;
    mime: string;
}
export interface FileUpload {
    filename: string;
    size?: number;
    mime: string;
    data?: string;
}
