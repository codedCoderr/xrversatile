import { ConflictException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model } from 'mongoose';

import { SCHEMAS } from '@src/constants';

import { User } from '@src/user/schemas/user.schema';
import { Logger } from '@logger/index';
import {
  PaginationResult,
  PaginationService,
} from '@src/util/pagination.service';
import { isEmpty } from 'lodash';
import { Subscriber } from './schemas/subscriber.schema';
import { Campaign } from './schemas/campaign.schema';
import { CampaignSortEnum, ScheduleCampaignInput } from './types';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(SCHEMAS.CAMPAIGN)
    private readonly campaignModel: Model<Campaign>,
    @InjectModel(SCHEMAS.SUBSCRIBER)
    private readonly subscriberModel: Model<Subscriber>,
    @InjectConnection() private readonly connection: Connection,
    private paginationService: PaginationService,
  ) {}

  async scheduleCampaign(
    user: User,
    input: ScheduleCampaignInput,
    logger: Logger,
  ): Promise<Campaign> {
    logger.info('scheduling campaign');

    input.createdBy = user;
    const campaign = await this.campaignModel.create({
      ...input,
    });

    // send email to subscribers

    return campaign;
  }

  async subscribeToCampaign(email: string, logger: Logger): Promise<void> {
    logger.info('subscribing to campaign');

    const foundSubscriber = await this.subscriberModel.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (!isEmpty(foundSubscriber)) {
      throw new ConflictException(`You've already subscribed to this campaign`);
    } else {
      await this.subscriberModel.create({
        email,
      });
    }
  }

  async fetchSubscribers(
    logger: Logger,
    search?: string,
    sort?: string,
    page = 1,
    perPage = 10,
  ): Promise<PaginationResult<Subscriber>> {
    logger.info('fetching campaign subscribers');

    const match: FilterQuery<Subscriber> = {
      isDeleted: false,
    };

    if (!isEmpty(search)) {
      match.email = { $regex: search, $options: 'i' };
    }
    const sortQuery: any = {};

    if (sort === CampaignSortEnum.Newest) {
      sortQuery.createdAt = -1;
    } else if (sort === CampaignSortEnum.Oldest) {
      sortQuery.createdAt = 1;
    } else if (sort === CampaignSortEnum.Alphabetically) {
      sortQuery.type = 1;
    }

    const subscribers = await this.paginationService.paginate(
      this.subscriberModel as any,
      match,
      null,
      page,
      perPage,
      null,
      [sortQuery],
    );

    return subscribers as any;
  }

  async deleteSubscriber(subscriberId: string, logger: Logger): Promise<void> {
    logger.info(`deleting campaign subscriber with id of ${subscriberId}`);
    const foundSubscriber = await this.subscriberModel.findOne({
      _id: subscriberId,
      isDeleted: { $ne: true },
    });

    foundSubscriber.isDeleted = true;
    foundSubscriber.deletedAt = new Date();
    foundSubscriber.save();
  }

  async fetchCampaigns(
    logger: Logger,
    search?: string,
    sort?: string,
    page = 1,
    perPage = 10,
  ): Promise<PaginationResult<Campaign>> {
    logger.info('fetching campaigns');

    const match: FilterQuery<Campaign> = {
      isDeleted: false,
    };

    if (!isEmpty(search)) {
      match.type = { $regex: search, $options: 'i' };
    }
    const sortQuery: any = {};

    if (sort === CampaignSortEnum.Newest) {
      sortQuery.createdAt = -1;
    } else if (sort === CampaignSortEnum.Oldest) {
      sortQuery.createdAt = 1;
    } else if (sort === CampaignSortEnum.Alphabetically) {
      sortQuery.type = 1;
    }

    const campaigns = await this.paginationService.paginate(
      this.campaignModel as any,
      match,
      null,
      page,
      perPage,
      null,
      [sortQuery],
    );

    return campaigns as any;
  }

  async deleteCampaign(campaignId: string, logger: Logger): Promise<void> {
    logger.info(`deleting campaign with id of ${campaignId}`);
    const foundCampaign = await this.campaignModel.findOne({
      _id: campaignId,
      isDeleted: { $ne: true },
    });

    foundCampaign.isDeleted = true;
    foundCampaign.deletedAt = new Date();
    foundCampaign.save();
  }
}
