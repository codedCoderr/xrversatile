import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
import { User } from '@src/user/schemas/user.schema';
export declare class Campaign extends BaseSchemaInterface {
    type: string;
    content: string;
    date: Date;
    createdBy: User;
    isDeleted: boolean;
    deletedAt: Date;
}
export type CampaignDocument = Campaign & Document;
declare const CampaignSchema: import("mongoose").Schema<Campaign, import("mongoose").Model<Campaign, any, any, any, import("mongoose").Document<unknown, any, Campaign> & Campaign & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Campaign, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Campaign>> & import("mongoose").FlatRecord<Campaign> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export { CampaignSchema };
