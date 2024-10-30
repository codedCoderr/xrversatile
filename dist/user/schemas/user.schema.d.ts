import { Document } from 'mongoose';
import { BaseSchemaInterface } from '@shared/interfaces/base.interface';
import { RoleEnum } from '../dto/user.dto';
export declare class User extends BaseSchemaInterface {
    email: string;
    firstName: string;
    middleName?: string;
    phoneNumber?: string;
    lastName: string;
    password: string;
    role: RoleEnum;
    profileImage?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
}
export type UserDocument = User & Document;
declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export { UserSchema };
