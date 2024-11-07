import {
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { FileUploadDTO } from '@src/uploader/dto';
import { JobApplicationStatus } from '../types';

export class CVUploadDTO extends FileUploadDTO {
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
export class JobApplicationAgendaMoveInput {
  @IsNotEmpty()
  @IsString()
  currentAgendaID: string;

  @IsNotEmpty()
  @IsString()
  activeAgendaID: string;
}

export class ToggleApplicationStatusDTO {
  @IsEnum(JobApplicationStatus)
  @IsIn([JobApplicationStatus.Rejected, JobApplicationStatus.Active])
  status: JobApplicationStatus;

  @IsOptional()
  @IsString()
  rejectionLetterContent?: string;

  @IsOptional()
  @IsMongoId()
  activeAgendaID?: string;
}
