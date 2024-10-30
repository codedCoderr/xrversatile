import { Response } from 'express';
import { ResponseService } from '@src/util/response.service';
import Logger from '@src/logger/winston.service';
import { UserDocument } from '@src/user/schemas/user.schema';
import { ScheduleCampaignInput } from './types';
import { CampaignService } from './campaign.service';
export declare class CampaignController {
    private responseService;
    private campaignService;
    private logger;
    constructor(logger: Logger, responseService: ResponseService, campaignService: CampaignService);
    scheduleCampaign(res: Response, currentUser: UserDocument, input: ScheduleCampaignInput): Promise<any>;
    subscribeToCampaign(res: Response, input: {
        email: string;
    }): Promise<any>;
    fetchSubscribers(res: Response, input: {
        perPage: number;
        page: number;
        search: string;
        sort: string;
    }): Promise<any>;
    fetchCampaigns(res: Response, input: {
        perPage: number;
        page: number;
        search: string;
        sort: string;
    }): Promise<any>;
    deleteCampaign(res: Response, campaign: string): Promise<any>;
    deleteSubscriber(res: Response, subscriber: string): Promise<any>;
}
