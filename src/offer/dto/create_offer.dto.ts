import { JobApplication, JobOpening } from '@src/job/interfaces';
import { User } from '@src/user/schemas/user.schema';
import { CurrencyAmount } from '@src/util';

export class CreateOfferDTO {
  job: JobOpening;

  application: JobApplication;

  content: string;

  subject: string;

  sentBy: User;

  salaryAmount?: CurrencyAmount;

  resumptionDate?: Date;
}
