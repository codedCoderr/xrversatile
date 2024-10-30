import { User } from '@src/user/schemas/user.schema';
export declare class ScheduleMeetingInput {
    title: string;
    jobApplicationAgenda: string;
    description?: string;
    createdBy?: User;
    startTime: Date;
    endTime: Date;
    meetingLink: string;
}
