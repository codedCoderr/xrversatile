import { User } from '@src/user/schemas/user.schema';

export class ScheduleCampaignInput {
  type: string;

  content: string;

  createdBy?: User;

  date: Date;
}

export enum CampaignSortEnum {
  Newest = 'newest',
  Oldest = 'oldest',
  Alphabetically = 'alpha',
}
