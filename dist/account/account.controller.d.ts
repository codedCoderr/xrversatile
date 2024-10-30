import { Logger } from 'winston';
import { Response } from 'express';
import { CreateUserDTO, ResetPasswordDTO, UpdateUserDTO } from '@src/user/dto/user.dto';
import { UserDocument } from '@src/user/schemas/user.schema';
import { ResponseService } from '@src/util/response.service';
import { FileUploadDTO } from '@src/uploader/dto';
import { AccountService } from './account.service';
export declare class AccountController {
    private accountService;
    private responseService;
    private logger;
    constructor(logger: Logger, accountService: AccountService, responseService: ResponseService);
    createAdmin(res: Response, body: CreateUserDTO, user: UserDocument): Promise<any>;
    login(res: Response, user: UserDocument): Promise<any>;
    getLoggedInAdmin(res: Response, user: UserDocument): Promise<void>;
    getAdmins(res: Response, input: {
        perPage: number;
        page: number;
    }): Promise<void>;
    updateProfile(res: Response, user: UserDocument, body: UpdateUserDTO): Promise<void>;
    updateAdmin(res: Response, currentUser: UserDocument, body: Partial<UpdateUserDTO>, param: {
        id: string;
    }): Promise<void>;
    deleteAdmin(res: Response, param: {
        id: string;
    }, currentUser: UserDocument): Promise<any>;
    resetPassword(res: Response, user: UserDocument, body: ResetPasswordDTO): Promise<void>;
    getStats(res: Response): Promise<void>;
    getJobEngagementOverview(res: Response): Promise<void>;
    uploadProfileImage(res: Response, body: FileUploadDTO): Promise<void>;
}
