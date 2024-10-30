import { JobOpeningStatus, JobType } from '../types';
import { User } from '@src/user/schemas/user.schema';
export declare class JobOpeningDTO {
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
export declare class UpdateJobOpeningStatusDTO {
    status: JobOpeningStatus;
}
