import { JobApplicationAgenda } from '@src/job/interfaces';
import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
import { User } from '@src/user/schemas/user.schema';
export declare class Meeting extends BaseSchemaInterface {
    title: string;
    description: string;
    meetingLink: string;
    startTime: Date;
    endTime: Date;
    jobApplicationAgenda: JobApplicationAgenda;
    createdBy: User;
    isDeleted: boolean;
    deletedAt: Date;
}
export type MeetingDocument = Meeting & Document;
declare const MeetingSchema: import("mongoose").Schema<Meeting, import("mongoose").Model<Meeting, any, any, any, import("mongoose").Document<unknown, any, Meeting> & Meeting & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Meeting, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Meeting>> & import("mongoose").FlatRecord<Meeting> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export { MeetingSchema };
