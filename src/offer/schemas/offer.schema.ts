import { Schema } from 'mongoose';

import { SCHEMAS } from '@constants/index';
import { OfferStatuses } from '../interfaces/offer.interface';

export const CurrencyAmountSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

export const OfferSchema = new Schema(
  {
    subject: {
      type: String,
    },
    content: {
      type: String,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: SCHEMAS.JOB_APPLICATION,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: SCHEMAS.JOB_OPENING,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: SCHEMAS.USER,
    },
    scriptSignUUID: {
      type: String,
    },
    documentUrl: {
      type: String,
    },
    salaryAmount: {
      type: CurrencyAmountSchema,
    },
    resumptionDate: {
      type: String,
    },
    status: {
      type: String,
      enum: OfferStatuses,
    },
    cancelReason: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      /* eslint-disable no-param-reassign */
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      transform: (_doc: any, ret: any): void => {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);
