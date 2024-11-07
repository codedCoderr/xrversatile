import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UploadedResourceDTO {
  public url: string;

  public filename: string;

  public bucket: string;

  public size: number;

  public type: string;
}

export class FileUploadDTO {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsString()
  mime: string;

  @IsString()
  @IsOptional()
  data?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  folder?: string;
}

export class CVUploadDTO extends FileUploadDTO {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phonenumber?: string;
}
