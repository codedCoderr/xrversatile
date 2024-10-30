import { Response } from 'express';
import { Logger } from 'winston';
import { ResponseService } from '@src/util';
import { ScheduleConsultationDTO } from './dto';
import { ConsultationService } from './consultation.service';
export declare class ConsultationController {
    private consultationService;
    private responseService;
    private logger;
    constructor(logger: Logger, consultationService: ConsultationService, responseService: ResponseService);
    schedule(res: Response, body: ScheduleConsultationDTO): Promise<any>;
}
