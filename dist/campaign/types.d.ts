import { User } from '@src/user/schemas/user.schema';
export declare class ScheduleCampaignInput {
    type: string;
    content: string;
    createdBy?: User;
    date: Date;
}
export declare enum CampaignSortEnum {
    Newest = "newest",
    Oldest = "oldest",
    Alphabetically = "alpha"
}
