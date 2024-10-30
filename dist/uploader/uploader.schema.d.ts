import { Schema } from 'mongoose';
export declare const UploadedResourceSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    url: string;
    mime: string;
    filename?: string;
    size?: number;
    bucket?: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    url: string;
    mime: string;
    filename?: string;
    size?: number;
    bucket?: string;
}>> & import("mongoose").FlatRecord<{
    url: string;
    mime: string;
    filename?: string;
    size?: number;
    bucket?: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
