import { IsNotEmpty } from 'class-validator';

export declare class UploadedResourceDTO {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  bucket: string;

  @IsNotEmpty()
  @IsString()
  size: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}
export declare class FileUploadDTO {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  size?: number;

  @IsNotEmpty()
  @IsString()
  mime: string;

  @IsOptional()
  @IsString()
  data?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  folder?: string;
}
export declare class CVUploadDTO extends FileUploadDTO {
  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phonenumber?: string;
}
