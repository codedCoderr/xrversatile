import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '@config/env/configuration';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import { LoggerModule } from '@logger/logger.module';
import { UtilModule } from '@util/util.module';
import { AccountModule } from '@account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { UploaderModule } from './uploader/uploader.module';
import { MeetingModule } from './meeting/meeting.module';
// import { CampaignController } from './campaign/campaign.controller';
import { CampaignModule } from './campaign/campaign.module';
import { OfferModule } from './offer/offer.module';
import { ConsultationModule } from './consultation/consultation.module';
import { AuditLogModule } from './auditlog/auditlog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: configuration().isTest(),
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    {
      module: LoggerModule,
      global: true,
    },
    MongooseModule.forRoot(configuration().database.url),
    UserModule,
    UtilModule,
    AccountModule,
    JobModule,
    UploaderModule,
    MeetingModule,
    CampaignModule,
    OfferModule,
    ConsultationModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [UserModule],
})
export class AppModule {}
