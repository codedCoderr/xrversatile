"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = void 0;
const winston_1 = require("winston");
const winston_loggly_bulk_1 = require("winston-loggly-bulk");
exports.default = winston_1.Logger;
const factory = (configService) => {
    const logLevel = configService.get('LOG_LEVEL');
    const logger = (0, winston_1.createLogger)({
        level: logLevel,
        format: winston_1.format === null || winston_1.format === void 0 ? void 0 : winston_1.format.json(),
        defaultMeta: { service: 'xrversatile' },
    });
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
    }));
    const env = configService.get('env');
    if (env === 'staging' || env === 'production') {
        const token = configService.get('loggly.token');
        const subdomain = configService.get('loggly.subdomain');
        logger.add(new winston_loggly_bulk_1.Loggly({
            level: 'info',
            token,
            subdomain,
            tags: ['api', env],
            json: true,
        }));
    }
    return logger;
};
exports.factory = factory;
//# sourceMappingURL=winston.service.js.map