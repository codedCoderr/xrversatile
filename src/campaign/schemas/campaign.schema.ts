import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from '@src/constants';
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
export class Campaign extends BaseSchemaInterface {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  @IsNotEmpty()
  type: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  @IsNotEmpty()
  content: string;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
  })
  @IsNotEmpty()
  date: Date;

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

export type CampaignDocument = Campaign & Document;

const CampaignSchema = SchemaFactory.createForClass(Campaign);

export { CampaignSchema };
