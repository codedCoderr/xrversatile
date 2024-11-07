import { FileUploadDTO } from '@src/uploader/dto';
import { JobApplicationStatus } from '../types';

export declare class CVUploadDTO extends FileUploadDTO {
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string;
}
export declare class JobApplicationAgendaMoveInput {
  currentAgendaID: string;
  activeAgendaID: string;
}
export declare class ToggleApplicationStatusDTO {
  status: JobApplicationStatus;
  rejectionLetterContent?: string;
  activeAgendaID?: string;
}
