import { Schema } from 'mongoose';
import { AgendaStatus } from '../types';
export declare const JobApplicationAgendaSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: AgendaStatus;
    isDeleted: boolean;
    jobApplication: import("mongoose").Types.ObjectId;
    type?: string;
    description?: string;
    deletedAt?: NativeDate;
    title?: string;
    meeting?: import("mongoose").Types.ObjectId;
}, any>;
