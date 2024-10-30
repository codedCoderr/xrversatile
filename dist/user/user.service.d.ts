import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { Logger } from '../logger';
export declare class UserService {
    private readonly userModel;
    private logger;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string, logger: Logger): Promise<UserDocument>;
    findByID(id: string, logger: Logger): Promise<UserDocument>;
}
