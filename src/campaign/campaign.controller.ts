import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { LOGGER } from '@src/constants';
import { ResponseService } from '@src/util/response.service';
import Logger from '@src/logger/winston.service';
import { UserDocument } from '@src/user/schemas/user.schema';
import { CurrentUser } from '@src/shared/decorators';
import { clone } from 'lodash';
import { ScheduleCampaignInput } from './types';
import { CampaignService } from './campaign.service';

@Controller('campaign')
export class CampaignController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private responseService: ResponseService,
    private campaignService: CampaignService,
  ) {
    this.logger = logger.child({
      context: { service: 'CampaignController', module: 'Campaign' },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('schedule')
  async scheduleCampaign(
    @Res() res: Response,
    @CurrentUser() currentUser: UserDocument,
    @Body() input: ScheduleCampaignInput,
  ): Promise<any> {
    const user = clone(currentUser) as UserDocument;

    try {
      const campaign = await this.campaignService.scheduleCampaign(
        user,
        input,
        this.logger,
      );

      return this.responseService.json(
        res,
        200,
        'Campaign scheduled successfully',
        campaign,
      );
    } catch (error) {
      this.logger.error(`issue scheduling campaign: ${error.message}`);
      return this.responseService.json(res, error);
    }
  }

  @Post('subscribe')
  async subscribeToCampaign(
    @Res() res: Response,
    @Body() input: { email: string },
  ): Promise<any> {
    try {
      await this.campaignService.subscribeToCampaign(input.email, this.logger);

      return this.responseService.json(
        res,
        200,
        'Subscribed to campaign successfully',
      );
    } catch (error) {
      this.logger.error(`issue subscribing to campaign: ${error.message}`);
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscribers')
  async fetchSubscribers(
    @Res() res: Response,
    @Query()
    input: {
      perPage: number;
      page: number;
      search: string;
      sort: string;
    },
  ): Promise<any> {
    try {
      const { perPage, page, search, sort } = input;
      const payload = await this.campaignService.fetchSubscribers(
        this.logger,
        search,
        sort,
        page,
        perPage,
      );

      return this.responseService.json(
        res,
        200,
        'Subscribers fetched successfully',
        payload.data,
        payload.metadata,
      );
    } catch (error) {
      this.logger.error(`issue fetching subscribers: ${error.message}`);
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async fetchCampaigns(
    @Res() res: Response,
    @Query()
    input: {
      perPage: number;
      page: number;
      search: string;
      sort: string;
    },
  ): Promise<any> {
    try {
      const { perPage, page, search, sort } = input;
      const payload = await this.campaignService.fetchCampaigns(
        this.logger,
        search,
        sort,
        page,
        perPage,
      );

      return this.responseService.json(
        res,
        200,
        'Campaigns fetched successfully',
        payload.data,
        payload.metadata,
      );
    } catch (error) {
      this.logger.error(`issue fetching campaigns: ${error.message}`);
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:campaignId')
  async deleteCampaign(
    @Res() res: Response,
    @Param('campaignId') campaign: string,
  ): Promise<any> {
    try {
      await this.campaignService.deleteCampaign(campaign, this.logger);

      return this.responseService.json(
        res,
        204,
        'Campaign deleted successfully',
      );
    } catch (error) {
      this.logger.error(`issue deleting campaign : ${error.message}`);
      return this.responseService.json(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('subscriber/:subscriberId')
  async deleteSubscriber(
    @Res() res: Response,
    @Param('subscriberId') subscriber: string,
  ): Promise<any> {
    try {
      await this.campaignService.deleteSubscriber(subscriber, this.logger);

      return this.responseService.json(
        res,
        204,
        'Campaign subscriber deleted successfully',
      );
    } catch (error) {
      this.logger.error(
        `issue deleting campaign subscriber : ${error.message}`,
      );
      return this.responseService.json(res, error);
    }
  }
}
