import { Schema } from 'mongoose';
import { SCHEMAS } from '@src/constants';
import { AgendaStatuses, AgendaStatus } from '../types';

export const JobApplicationAgendaSchema = new Schema(
  {
    type: {
      type: String,
    },
    jobApplication: {
      type: Schema.Types.ObjectId,
      ref: SCHEMAS.JOB_APPLICATION,
      required: true,
    },
    meeting: {
      type: Schema.Types.ObjectId,
      ref: SCHEMAS.MEETING,
    },
    status: {
      type: String,
      enum: AgendaStatuses,
      default: AgendaStatus.Scheduled,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
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
