import { IsEnum, IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';

import { FileUploadDTO } from '@src/uploader/dto';
import { JobApplicationStatus } from '../types';

export class CVUploadDTO extends FileUploadDTO {
  firstname?: string;

  lastname?: string;

  email?: string;

  phonenumber: string;
}
export class JobApplicationAgendaMoveInput {
  currentAgendaID: string;

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
