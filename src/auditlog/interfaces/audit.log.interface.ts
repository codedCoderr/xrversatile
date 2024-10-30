import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { USER } from '@src/constants/schema_constants';
import { BaseSchemaDecorator } from '@src/shared/decorators/base_schema.decorator';
import { BaseSchemaInterface } from '@src/shared/interfaces/base.interface';
import { UserDocument } from '@src/user/schemas/user.schema';
import { IsString, IsNotEmpty } from 'class-validator';
import { SchemaTypes } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@BaseSchemaDecorator()
export class AuditLog extends BaseSchemaInterface {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  message: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: USER,
    required: true,
    autopopulate: {
      select: 'email firstName lastName isDeleted',
      maxDepth: 1,
    },
  })
  doneBy: UserDocument;

  @Prop({ type: SchemaTypes.Mixed })
  payload?: unknown;
}

const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

export { AuditLogSchema };
