import { Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { ScheduleConsultationDTO } from './dto';

@Injectable()
export class ConsultationService {
  async scheduleConsultation(
    input: ScheduleConsultationDTO,
    logger: Logger,
  ): Promise<void> {
    logger.info('scheduling consultation');
  }
}
