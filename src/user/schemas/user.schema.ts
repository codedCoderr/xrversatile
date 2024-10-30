import { Document, SchemaTypes } from 'mongoose';
import { hashSync } from 'bcryptjs';
import { BaseSchemaDecorator } from '@shared/decorators/base_schema.decorator';
import { BaseSchemaInterface } from '@shared/interfaces/base.interface';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { RoleEnum } from '../dto/user.dto';

@BaseSchemaDecorator({
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any): void => {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  },
})
export class User extends BaseSchemaInterface {
  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
  })
  @IsNotEmpty()
  email: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  @IsNotEmpty()
  firstName: string;

  @Prop({
    type: SchemaTypes.String,
  })
  @IsOptional()
  middleName?: string;

  @Prop({
    type: SchemaTypes.String,
  })
  @IsOptional()
  phoneNumber?: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  @IsNotEmpty()
  lastName: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    default: RoleEnum.Admin,
  })
  @IsNotEmpty()
  role: RoleEnum;

  @Prop({
    type: SchemaTypes.String,
  })
  @IsOptional()
  profileImage?: string;

  @Prop({
    type: SchemaTypes.Boolean,
    required: false,
    default: false,
  })
  isDeleted?: boolean;

  @Prop({
    type: SchemaTypes.Date,
  })
  deletedAt?: Date;
}

export type UserDocument = User & Document;

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function hashPassword(next): void {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const values = this as unknown as UserDocument;
  const hash = hashSync(values.password, 8);
  values.password = hash;
  next();
});

export { UserSchema };
