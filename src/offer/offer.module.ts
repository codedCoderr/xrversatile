import { forwardRef, Module } from '@nestjs/common';

import { JobModule } from '@src/job/job.module';
import { UploaderModule } from '@src/uploader/uploader.module';
// import { TemplateModule } from '@src/template/template.module';
import { UtilModule } from '@src/util/util.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from '@src/constants';

import { JobApplicationSchema } from '@src/job/schemas';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { OfferSchema } from './schemas/offer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SCHEMAS.OFFER, schema: OfferSchema },
      { name: SCHEMAS.JOB_APPLICATION, schema: JobApplicationSchema },
    ]),
    forwardRef(() => JobModule),
    UploaderModule,
    // TemplateModule,
    UtilModule,
  ],
  providers: [OfferService],
  exports: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
