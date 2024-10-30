import { SchemaTypes } from 'mongoose';
import { SCHEMAS } from '@src/constants';
import { JobOpeningStatus, JobOpeningStatuses, JobType } from '../types';
import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { User } from '@src/user/schemas/user.schema';
import { BaseSchemaDecorator } from '@src/shared/decorators/base_schema.decorator';

@BaseSchemaDecorator({
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any): void => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class JobOpening extends BaseSchemaInterface {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  @IsNotEmpty()
  companyName: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @Prop({
    type: SchemaTypes.String,
  })
  description: string;

  @Prop({
    type: SchemaTypes.String,
    default: JobType.FullTime,
    required: true,
  })
  @IsNotEmpty()
  category: string;

  @Prop({
    type: SchemaTypes.String,
  })
  location: string;

  @Prop({
    type: SchemaTypes.String,
  })
  requirements: string;

  @Prop({
    type: SchemaTypes.String,
  })
  responsibilities: string;

  @Prop({
    type: SchemaTypes.String,
  })
  benefits: string;

  @Prop({
    type: SchemaTypes.String,
  })
  duration: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMAS.USER,
    required: true,
  })
  @IsNotEmpty()
  createdBy: User;

  @Prop({
    type: SchemaTypes.String,
    enum: JobOpeningStatuses,
    default: JobOpeningStatus.Active,
  })
  status: string;

  @Prop({
    type: SchemaTypes.Array,
  })
  reads: Date[];

  @Prop({
    type: SchemaTypes.Array,
    default: [],
  })
  agendas: string[];

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: SchemaTypes.String,
  })
  deletedAt: Date;
}

export type JobOpeningDocument = JobOpening & Document;

const JobOpeningSchema = SchemaFactory.createForClass(JobOpening);

export { JobOpeningSchema };
