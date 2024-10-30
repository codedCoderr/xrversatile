import { Connection, Model } from 'mongoose';
import { User } from '@src/user/schemas/user.schema';
import { Logger } from '@logger/index';
import { PaginationResult, PaginationService } from '@src/util/pagination.service';
import { Subscriber } from './schemas/subscriber.schema';
import { Campaign } from './schemas/campaign.schema';
import { ScheduleCampaignInput } from './types';
export declare class CampaignService {
    private readonly campaignModel;
    private readonly subscriberModel;
    private readonly connection;
    private paginationService;
    constructor(campaignModel: Model<Campaign>, subscriberModel: Model<Subscriber>, connection: Connection, paginationService: PaginationService);
    scheduleCampaign(user: User, input: ScheduleCampaignInput, logger: Logger): Promise<Campaign>;
    subscribeToCampaign(email: string, logger: Logger): Promise<void>;
    fetchSubscribers(logger: Logger, search?: string, sort?: string, page?: number, perPage?: number): Promise<PaginationResult<Subscriber>>;
    deleteSubscriber(subscriberId: string, logger: Logger): Promise<void>;
    fetchCampaigns(logger: Logger, search?: string, sort?: string, page?: number, perPage?: number): Promise<PaginationResult<Campaign>>;
    deleteCampaign(campaignId: string, logger: Logger): Promise<void>;
}
