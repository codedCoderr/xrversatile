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
export class Subscriber extends BaseSchemaInterface {
  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
  })
  @IsNotEmpty()
  email: string;

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

export type SubscriberDocument = Subscriber & Document;

const SubscriberSchema = SchemaFactory.createForClass(Subscriber);

SubscriberSchema.index({
  email: 1,
});

export { SubscriberSchema };
