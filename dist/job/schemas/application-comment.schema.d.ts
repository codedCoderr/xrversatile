import { Schema, Types } from 'mongoose';
export declare const JobApplicationCommentSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    application: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    isDeleted: boolean;
    job: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    content: string;
    sender: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    deletedAt?: NativeDate;
}, any>;
