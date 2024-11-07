import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '@src/user/schemas/user.schema';
import { JobOpeningStatus, JobOpeningStatuses, JobType } from '../types';

export class JobOpeningDTO {
  @IsOptional()
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category: JobType;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  createdBy: User;

  @IsOptional()
  @IsString()
  agendas?: string[];

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @IsOptional()
  @IsDate()
  deletedAt: Date;

  @IsOptional()
  @IsDate()
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
