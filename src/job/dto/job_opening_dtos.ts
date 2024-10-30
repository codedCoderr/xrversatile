import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { JobOpeningStatus, JobOpeningStatuses, JobType } from '../types';
import { User } from '@src/user/schemas/user.schema';

export class JobOpeningDTO {
  companyName: string;
  title: string;
  description: string;
  category: JobType;
  location: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  duration?: string;
  createdBy: User;
  agendas?: string[];
  updatedAt: Date;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
  closedAt: Date;
}

export class UpdateJobOpeningStatusDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(JobOpeningStatus, {
    message: `Status must be one of ${JSON.stringify(JobOpeningStatuses)}`,
  })
  status: JobOpeningStatus;
}
