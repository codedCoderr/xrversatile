"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationController = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const constants_1 = require("../constants");
const util_1 = require("../util");
const dto_1 = require("./dto");
const consultation_service_1 = require("./consultation.service");
let ConsultationController = class ConsultationController {
    constructor(logger, consultationService, responseService) {
        this.consultationService = consultationService;
        this.responseService = responseService;
        this.logger = logger.child({
            context: {
                service: 'ConsultationController',
                module: 'Consultation',
            },
        });
    }
    async schedule(res, body) {
        try {
            const payload = await this.consultationService.scheduleConsultation(body, this.logger);
            return this.responseService.json(res, 200, 'Consultation scheduled successfully', payload);
        }
        catch (error) {
            this.logger.error(`issue scheduling consultation: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
};
exports.ConsultationController = ConsultationController;
__decorate([
    (0, common_1.Post)('schedule'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.ScheduleConsultationDTO]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "schedule", null);
exports.ConsultationController = ConsultationController = __decorate([
    (0, common_1.Controller)('consultation'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        consultation_service_1.ConsultationService,
        util_1.ResponseService])
], ConsultationController);
//# sourceMappingURL=consultation.controller.js.map