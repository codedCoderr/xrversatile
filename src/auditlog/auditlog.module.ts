import { Module } from '@nestjs/common';
import { AuditLogController } from './auditlog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogSchema } from './interfaces/audit.log.interface';
import { AUDIT_LOG } from '@src/constants/schema_constants';
import { AuditLogService } from './auditlog.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AUDIT_LOG, schema: AuditLogSchema }]),
  ],
  exports: [AuditLogService],
  controllers: [AuditLogController],
  providers: [AuditLogService],
})
export class AuditLogModule {}
