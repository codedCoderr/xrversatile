import { Logger } from 'winston';
import { ScheduleConsultationDTO } from './dto';
export declare class ConsultationService {
    scheduleConsultation(input: ScheduleConsultationDTO, logger: Logger): Promise<void>;
}
