import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
export declare class Subscriber extends BaseSchemaInterface {
    email: string;
    isDeleted: boolean;
    deletedAt: Date;
}
export type SubscriberDocument = Subscriber & Document;
declare const SubscriberSchema: import("mongoose").Schema<Subscriber, import("mongoose").Model<Subscriber, any, any, any, import("mongoose").Document<unknown, any, Subscriber> & Subscriber & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscriber, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Subscriber>> & import("mongoose").FlatRecord<Subscriber> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export { SubscriberSchema };
