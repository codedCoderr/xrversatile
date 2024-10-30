import { Schema } from 'mongoose';

export const UploadedResourceSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
    },
    bucket: {
      type: String,
    },
    mime: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
    },
  },
  { _id: false },
);
