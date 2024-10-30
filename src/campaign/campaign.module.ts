import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CAMPAIGN, SUBSCRIBER } from '@src/constants/schema_constants';
import { CampaignService } from './campaign.service';
import { CampaignSchema } from './schemas/campaign.schema';
import { CampaignController } from './campaign.controller';
import { SubscriberSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CAMPAIGN, schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: SUBSCRIBER, schema: SubscriberSchema }]),
  ],
  controllers: [CampaignController],

  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
