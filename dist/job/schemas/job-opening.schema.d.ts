import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
import { User } from '@src/user/schemas/user.schema';
export declare class JobOpening extends BaseSchemaInterface {
    companyName: string;
    title: string;
    description: string;
    category: string;
    location: string;
    requirements: string;
    responsibilities: string;
    benefits: string;
    duration: string;
    createdBy: User;
    status: string;
    reads: Date[];
    agendas: string[];
    isDeleted: boolean;
    deletedAt: Date;
}
export type JobOpeningDocument = JobOpening & Document;
declare const JobOpeningSchema: import("mongoose").Schema<JobOpening, import("mongoose").Model<JobOpening, any, any, any, import("mongoose").Document<unknown, any, JobOpening> & JobOpening & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, JobOpening, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<JobOpening>> & import("mongoose").FlatRecord<JobOpening> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export { JobOpeningSchema };
