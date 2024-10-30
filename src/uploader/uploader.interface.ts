import { FileUpload } from './interfaces';

export interface Uploader {
  name(): string;
  upload(
    filepath: string,
    content: Buffer | string,
    upload?: FileUpload,
  ): Promise<string>;
  delete(filename: string): Promise<boolean>;
}
