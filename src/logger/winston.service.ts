import { ConfigService } from '@nestjs/config';
import { Logger, createLogger, format, transports } from 'winston';

import { Loggly } from 'winston-loggly-bulk';

export type LoggerService = Logger;
export default Logger;

export const factory = (configService: ConfigService): Logger => {
  const logLevel = configService.get<string>('LOG_LEVEL');
  const logger = createLogger({
    level: logLevel,
    format: format?.json(),
    defaultMeta: { service: 'xrversatile' },
  });

  // A console transport logging debug and above.
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );

  const env = configService.get<string>('env');
  if (env === 'staging' || env === 'production') {
    const token = configService.get<string>('loggly.token');
    const subdomain = configService.get<string>('loggly.subdomain');
    // A Loggly transports for info and above
    logger.add(
      new Loggly({
        level: 'info',
        token,
        subdomain,
        tags: ['api', env],
        json: true,
      }),
    );
  }
  return logger;
};
