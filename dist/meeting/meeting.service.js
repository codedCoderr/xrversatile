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
exports.MeetingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../constants");
const job_application_service_1 = require("../job/job_application.service");
let MeetingService = class MeetingService {
    constructor(meetingModel, connection, jobApplicationService) {
        this.meetingModel = meetingModel;
        this.connection = connection;
        this.jobApplicationService = jobApplicationService;
    }
    async scheduleMeeting(user, input, logger) {
        logger.info('scheduling meeting');
        const session = await this.connection.startSession();
        session.startTransaction();
        input.createdBy = user;
        try {
            const meeting = await this.meetingModel.create(Object.assign(Object.assign({}, input), { session }));
            if (input.jobApplicationAgenda) {
                await this.jobApplicationService.setApplicationAgendaMeeeting(input.jobApplicationAgenda, meeting, logger, session);
            }
            await session.commitTransaction();
            return meeting;
        }
        catch (e) {
            await session.abortTransaction();
            throw e;
        }
        finally {
            session.endSession();
        }
    }
};
exports.MeetingService = MeetingService;
exports.MeetingService = MeetingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.MEETING)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Connection,
        job_application_service_1.JobApplicationService])
], MeetingService);
//# sourceMappingURL=meeting.service.js.map