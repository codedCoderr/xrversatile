import { Logger } from '../logger';
import { UtilService } from '../util/util.service';
import { AccountService } from './account.service';
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private accountService;
    private utilService;
    private logger;
    constructor(accountService: AccountService, utilService: UtilService, logger: Logger);
    validate(username: string, password: string): Promise<any>;
}
export {};
