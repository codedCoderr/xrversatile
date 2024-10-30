import { Document } from 'mongoose';
import { UploadedResource } from '@src/uploader/interfaces';
import { UserDocument } from '@src/user/schemas/user.schema';
import { AgendaStatus, JobApplicationStatus, JobOpeningStatus, JobType, ParsedCVData } from '../types';
import { Meeting } from '@src/meeting/schemas/meeting.schema';
export interface JobOpening extends Document {
    id: string;
    companyName: string;
    title: string;
    description: string;
    category: JobType;
    requirements?: string;
    createdBy: string | UserDocument;
    status: JobOpeningStatus;
    benefits?: string;
    agendas: string[];
    updatedAt: Date;
    createdAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    closedAt: Date;
}
export type JobOpeningDocument = JobOpening & Document;
export interface JobApplicationAgenda extends Document {
    id: string;
    type: string;
    jobApplication: JobApplication;
    meeting?: Meeting;
    title: string;
    description?: string;
    status: AgendaStatus;
    startAt?: Date;
    endAt?: Date;
}
export type JobApplicationAgendaDocument = JobApplicationAgenda & Document;
export interface JobApplication extends Document {
    job: JobOpening;
    firstname: string;
    lastname: string;
    middlename?: string;
    email: string;
    phonenumber: string;
    status?: JobApplicationStatus;
    cvUrl?: UploadedResource;
    parsedData: ParsedCVData;
    agendas: JobApplicationAgenda[];
    isFavorite?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    readonly isDeleted: boolean;
    readonly deletedAt?: Date;
}
export type JobApplicationDocument = JobApplication & Document;
export interface JobApplicationComment extends Document {
    application: JobApplication;
    job: JobOpening;
    sender: UserDocument;
    content: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    index?: number;
}
export type JobApplicationCommentDocument = JobApplicationComment & Document;
export interface IFetchJobApplicationsResponse {
    [stage: string]: JobApplication[];
}
