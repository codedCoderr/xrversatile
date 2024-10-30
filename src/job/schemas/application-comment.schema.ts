import { Schema, Types } from 'mongoose';
import { SCHEMAS } from '@src/constants';

export const JobApplicationCommentSchema = new Schema(
  {
    application: {
      type: Types.ObjectId,
      ref: SCHEMAS.JOB_APPLICATION,
      required: true,
    },
    job: {
      type: Types.ObjectId,
      ref: SCHEMAS.JOB_OPENING,
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: SCHEMAS.USER,
      required: true,
    },
    content: {
      type: String,
      required: true,
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

JobApplicationCommentSchema.index({
  application: 1,
  isDeleted: 1,
});
