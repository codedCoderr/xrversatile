export class UploadedResourceDTO {
  public url: string;

  public filename: string;

  public bucket: string;

  public size: number;

  public type: string;
}

export class FileUploadDTO {
  filename: string;

  size?: number;

  mime: string;

  data?: string;

  url?: string;

  folder?: string;
}

export class CVUploadDTO extends FileUploadDTO {
  firstname?: string;

  lastname?: string;

  email?: string;

  phonenumber: string;
}
