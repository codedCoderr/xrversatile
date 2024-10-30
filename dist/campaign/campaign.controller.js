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
exports.CampaignController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const constants_1 = require("../constants");
const response_service_1 = require("../util/response.service");
const winston_service_1 = require("../logger/winston.service");
const decorators_1 = require("../shared/decorators");
const lodash_1 = require("lodash");
const types_1 = require("./types");
const campaign_service_1 = require("./campaign.service");
let CampaignController = class CampaignController {
    constructor(logger, responseService, campaignService) {
        this.responseService = responseService;
        this.campaignService = campaignService;
        this.logger = logger.child({
            context: { service: 'CampaignController', module: 'Campaign' },
        });
    }
    async scheduleCampaign(res, currentUser, input) {
        const user = (0, lodash_1.clone)(currentUser);
        try {
            const campaign = await this.campaignService.scheduleCampaign(user, input, this.logger);
            return this.responseService.json(res, 200, 'Campaign scheduled successfully', campaign);
        }
        catch (error) {
            this.logger.error(`issue scheduling campaign: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async subscribeToCampaign(res, input) {
        try {
            await this.campaignService.subscribeToCampaign(input.email, this.logger);
            return this.responseService.json(res, 200, 'Subscribed to campaign successfully');
        }
        catch (error) {
            this.logger.error(`issue subscribing to campaign: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async fetchSubscribers(res, input) {
        try {
            const { perPage, page, search, sort } = input;
            const payload = await this.campaignService.fetchSubscribers(this.logger, search, sort, page, perPage);
            return this.responseService.json(res, 200, 'Subscribers fetched successfully', payload.data, payload.metadata);
        }
        catch (error) {
            this.logger.error(`issue fetching subscribers: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async fetchCampaigns(res, input) {
        try {
            const { perPage, page, search, sort } = input;
            const payload = await this.campaignService.fetchCampaigns(this.logger, search, sort, page, perPage);
            return this.responseService.json(res, 200, 'Campaigns fetched successfully', payload.data, payload.metadata);
        }
        catch (error) {
            this.logger.error(`issue fetching campaigns: ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async deleteCampaign(res, campaign) {
        try {
            await this.campaignService.deleteCampaign(campaign, this.logger);
            return this.responseService.json(res, 204, 'Campaign deleted successfully');
        }
        catch (error) {
            this.logger.error(`issue deleting campaign : ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
    async deleteSubscriber(res, subscriber) {
        try {
            await this.campaignService.deleteSubscriber(subscriber, this.logger);
            return this.responseService.json(res, 204, 'Campaign subscriber deleted successfully');
        }
        catch (error) {
            this.logger.error(`issue deleting campaign subscriber : ${error.message}`);
            return this.responseService.json(res, error);
        }
    }
};
exports.CampaignController = CampaignController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('schedule'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, types_1.ScheduleCampaignInput]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "scheduleCampaign", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "subscribeToCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('subscribers'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "fetchSubscribers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "fetchCampaigns", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/:campaignId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('campaignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "deleteCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('subscriber/:subscriberId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('subscriberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "deleteSubscriber", null);
exports.CampaignController = CampaignController = __decorate([
    (0, common_1.Controller)('campaign'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_service_1.default,
        response_service_1.ResponseService,
        campaign_service_1.CampaignService])
], CampaignController);
//# sourceMappingURL=campaign.controller.js.map