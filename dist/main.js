"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const index_1 = require("./constants/index");
const express_1 = require("express");
const all_exception_filter_1 = require("./all-exception.filter");
const cors_config_1 = require("./cors.config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: cors_config_1.default,
        bodyParser: false,
        bufferLogs: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionsFilter(app.get(index_1.LOGGER)));
    const port = process.env.PORT || 3000;
    app.use((0, express_1.json)({ limit: '100mb' }));
    app.use((0, express_1.urlencoded)({ limit: '100mb', extended: true }));
    await app.listen(port, '0.0.0.0');
    const logger = app.get(index_1.LOGGER);
    logger.info(`Application is running on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map