import { Schema, Types } from 'mongoose';
import { SCHEMAS } from '@src/constants';
import { UploadedResourceSchema } from '@src/uploader/uploader.schema';
import {
  AgendaStatuses,
  JobApplicationStatuses,
  JobApplicationStatus,
  AgendaStatus,
} from '../types';

export const JobApplicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: SCHEMAS.JOB_OPENING,
      required: true,
      index: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    middlename: {
      type: String,
    },
    email: {
      type: String,
    },
    phonenumber: {
      type: String,
    },
    status: {
      type: String,
      enum: JobApplicationStatuses,
      default: JobApplicationStatus.Active,
    },
    cvUrl: {
      type: UploadedResourceSchema,
    },
    coverLetter: {
      type: String,
    },
    agendas: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMAS.JOB_APPLICATION_AGENDA,
      },
    ],
    parsedData: {
      type: Object,
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

JobApplicationSchema.index({ job: 1, phonenumber: 1 }, { unique: true });
