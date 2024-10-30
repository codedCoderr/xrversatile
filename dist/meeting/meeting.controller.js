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
exports.MeetingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const constants_1 = require("../constants");
const response_service_1 = require("../util/response.service");
const winston_service_1 = require("../logger/winston.service");
const decorators_1 = require("../shared/decorators");
const lodash_1 = require("lodash");
const meeting_service_1 = require("./meeting.service");
const types_1 = require("./types");
let MeetingController = class MeetingController {
    constructor(logger, responseService, meetingService) {
        this.responseService = responseService;
        this.meetingService = meetingService;
        this.logger = logger.child({
            context: { service: 'MeetingController', module: 'Meeting' },
        });
    }
    async schedule(req, res, currentUser, input) {
        const user = (0, lodash_1.clone)(currentUser);
        try {
            const meeting = await this.meetingService.scheduleMeeting(user, input, this.logger);
            return this.responseService.json(res, 200, 'Meeting scheduled successfully', meeting);
        }
        catch (error) {
            this.logger.error(`issue scheduling meeting: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
};
exports.MeetingController = MeetingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('schedule'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, types_1.ScheduleMeetingInput]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "schedule", null);
exports.MeetingController = MeetingController = __decorate([
    (0, common_1.Controller)('meeting'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_service_1.default,
        response_service_1.ResponseService,
        meeting_service_1.MeetingService])
], MeetingController);
//# sourceMappingURL=meeting.controller.js.map