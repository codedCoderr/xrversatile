import { Logger } from '../logger';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    private logger;
    constructor(userService: UserService, logger: Logger);
    validate(payload: any): Promise<UserDocument>;
}
export {};
