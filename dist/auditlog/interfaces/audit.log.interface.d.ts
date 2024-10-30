import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
import { UserDocument } from '@src/user/schemas/user.schema';
export type AuditLogDocument = AuditLog & Document;
export declare class AuditLog extends BaseSchemaInterface {
    message: string;
    doneBy: UserDocument;
    payload?: unknown;
}
declare const AuditLogSchema: import("mongoose").Schema<AuditLog, import("mongoose").Model<AuditLog, any, any, any, import("mongoose").Document<unknown, any, AuditLog> & AuditLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AuditLog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<AuditLog>> & import("mongoose").FlatRecord<AuditLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export { AuditLogSchema };
