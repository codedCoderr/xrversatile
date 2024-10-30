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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../constants");
const pagination_service_1 = require("../util/pagination.service");
const lodash_1 = require("lodash");
const types_1 = require("./types");
let CampaignService = class CampaignService {
    constructor(campaignModel, subscriberModel, connection, paginationService) {
        this.campaignModel = campaignModel;
        this.subscriberModel = subscriberModel;
        this.connection = connection;
        this.paginationService = paginationService;
    }
    async scheduleCampaign(user, input, logger) {
        logger.info('scheduling campaign');
        input.createdBy = user;
        const campaign = await this.campaignModel.create(Object.assign({}, input));
        return campaign;
    }
    async subscribeToCampaign(email, logger) {
        logger.info('subscribing to campaign');
        const foundSubscriber = await this.subscriberModel.findOne({
            email,
            isDeleted: { $ne: true },
        });
        if (!(0, lodash_1.isEmpty)(foundSubscriber)) {
            throw new common_1.ConflictException(`You've already subscribed to this campaign`);
        }
        else {
            await this.subscriberModel.create({
                email,
            });
        }
    }
    async fetchSubscribers(logger, search, sort, page = 1, perPage = 10) {
        logger.info('fetching campaign subscribers');
        const match = {
            isDeleted: false,
        };
        if (!(0, lodash_1.isEmpty)(search)) {
            match.email = { $regex: search, $options: 'i' };
        }
        const sortQuery = {};
        if (sort === types_1.CampaignSortEnum.Newest) {
            sortQuery.createdAt = -1;
        }
        else if (sort === types_1.CampaignSortEnum.Oldest) {
            sortQuery.createdAt = 1;
        }
        else if (sort === types_1.CampaignSortEnum.Alphabetically) {
            sortQuery.type = 1;
        }
        const subscribers = await this.paginationService.paginate(this.subscriberModel, match, null, page, perPage, null, [sortQuery]);
        return subscribers;
    }
    async deleteSubscriber(subscriberId, logger) {
        logger.info(`deleting campaign subscriber with id of ${subscriberId}`);
        const foundSubscriber = await this.subscriberModel.findOne({
            _id: subscriberId,
            isDeleted: { $ne: true },
        });
        foundSubscriber.isDeleted = true;
        foundSubscriber.deletedAt = new Date();
        foundSubscriber.save();
    }
    async fetchCampaigns(logger, search, sort, page = 1, perPage = 10) {
        logger.info('fetching campaigns');
        const match = {
            isDeleted: false,
        };
        if (!(0, lodash_1.isEmpty)(search)) {
            match.type = { $regex: search, $options: 'i' };
        }
        const sortQuery = {};
        if (sort === types_1.CampaignSortEnum.Newest) {
            sortQuery.createdAt = -1;
        }
        else if (sort === types_1.CampaignSortEnum.Oldest) {
            sortQuery.createdAt = 1;
        }
        else if (sort === types_1.CampaignSortEnum.Alphabetically) {
            sortQuery.type = 1;
        }
        const campaigns = await this.paginationService.paginate(this.campaignModel, match, null, page, perPage, null, [sortQuery]);
        return campaigns;
    }
    async deleteCampaign(campaignId, logger) {
        logger.info(`deleting campaign with id of ${campaignId}`);
        const foundCampaign = await this.campaignModel.findOne({
            _id: campaignId,
            isDeleted: { $ne: true },
        });
        foundCampaign.isDeleted = true;
        foundCampaign.deletedAt = new Date();
        foundCampaign.save();
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.CAMPAIGN)),
    __param(1, (0, mongoose_1.InjectModel)(constants_1.SCHEMAS.SUBSCRIBER)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        pagination_service_1.PaginationService])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map