import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
export type LoggerService = Logger;
export default Logger;
export declare const factory: (configService: ConfigService) => Logger;
