import { Schema, Types } from 'mongoose';
import { JobApplicationStatus } from '../types';
export declare const JobApplicationSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: JobApplicationStatus;
    isDeleted: boolean;
    agendas: Types.ObjectId[];
    job: Types.ObjectId;
    email?: string;
    firstname?: string;
    lastname?: string;
    phonenumber?: string;
    deletedAt?: NativeDate;
    middlename?: string;
    cvUrl?: {
        url: string;
        mime: string;
        filename?: string;
        size?: number;
        bucket?: string;
    };
    parsedData?: any;
    coverLetter?: string;
}, any>;
