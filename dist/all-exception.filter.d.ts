import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Logger } from 'winston';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private logger;
    constructor(logger: Logger);
    catch(exception: Error, host: ArgumentsHost): void;
}
