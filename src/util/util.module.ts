import { Module, Global, forwardRef } from '@nestjs/common';
import * as Api2Pdf from 'api2pdf';
import { PDF_GENERATOR } from '@src/constants';
import { UploaderModule } from '@src/uploader/uploader.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import configuration from '../config/env/configuration';
import { UtilService } from './util.service';
import { ResponseService } from './response.service';
import { PaginationService } from './pagination.service';

@Global()
@Module({
  imports: [
    HttpModule,
    forwardRef(() => UploaderModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: configuration().jwt.secret,
        signOptions: { expiresIn: configuration().jwt.expiresIn },
      }),
    }),
  ],
  providers: [
    {
      provide: PDF_GENERATOR,
      useFactory: (): any => new Api2Pdf(configuration().api2pdf.apiKey),
    },
    UtilService,
    ResponseService,
    PaginationService,
  ],
  exports: [UtilService, ResponseService, PaginationService],
})
export class UtilModule {}
