import { Schema } from 'mongoose';
export declare const CurrencyAmountSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    value: number;
    currency: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    value: number;
    currency: string;
}>> & import("mongoose").FlatRecord<{
    value: number;
    currency: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const OfferSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isDeleted: boolean;
    subject?: string;
    application?: import("mongoose").Types.ObjectId;
    status?: import("../interfaces/offer.interface").OfferStatus;
    deletedAt?: NativeDate;
    job?: import("mongoose").Types.ObjectId;
    sentBy?: import("mongoose").Types.ObjectId;
    content?: string;
    documentUrl?: string;
    scriptSignUUID?: string;
    salaryAmount?: {
        value: number;
        currency: string;
    };
    resumptionDate?: string;
    cancelReason?: string;
}, any>;
