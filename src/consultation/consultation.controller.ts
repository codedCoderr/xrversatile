import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { Logger } from 'winston';
import { LOGGER } from '@src/constants';
import { ResponseService } from '@src/util';
import { ScheduleConsultationDTO } from './dto';
import { ConsultationService } from './consultation.service';

@Controller('consultation')
export class ConsultationController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private consultationService: ConsultationService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: {
        service: 'ConsultationController',
        module: 'Consultation',
      },
    });
  }

  @Post('schedule')
  async schedule(
    @Res() res: Response,
    @Body() body: ScheduleConsultationDTO,
  ): Promise<any> {
    try {
      const payload = await this.consultationService.scheduleConsultation(
        body,
        this.logger,
      );

      return this.responseService.json(
        res,
        200,
        'Consultation scheduled successfully',
        payload,
      );
    } catch (error) {
      this.logger.error(`issue scheduling consultation: ${error.message}`);
      return this.responseService.json(res, error);
    }
  }
}
