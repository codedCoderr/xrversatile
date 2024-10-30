import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from '@src/constants';
import { JobApplicationAgenda } from '@src/job/interfaces';
import { BaseSchemaDecorator } from '@src/shared/decorators/base_schema.decorator';
import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
import { User } from '@src/user/schemas/user.schema';
import { IsNotEmpty } from 'class-validator';
import { SchemaTypes } from 'mongoose';

@BaseSchemaDecorator({
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any): void => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Meeting extends BaseSchemaInterface {
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
    required: true,
  })
  @IsNotEmpty()
  meetingLink: string;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
  })
  @IsNotEmpty()
  startTime: Date;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
  })
  @IsNotEmpty()
  endTime: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMAS.JOB_APPLICATION_AGENDA,
    required: true,
  })
  @IsNotEmpty()
  jobApplicationAgenda: JobApplicationAgenda;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMAS.USER,
    required: true,
  })
  @IsNotEmpty()
  createdBy: User;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: SchemaTypes.Date,
  })
  deletedAt: Date;
}

export type MeetingDocument = Meeting & Document;

const MeetingSchema = SchemaFactory.createForClass(Meeting);

export { MeetingSchema };
