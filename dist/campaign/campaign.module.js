"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schema_constants_1 = require("../constants/schema_constants");
const campaign_service_1 = require("./campaign.service");
const campaign_schema_1 = require("./schemas/campaign.schema");
const campaign_controller_1 = require("./campaign.controller");
const schemas_1 = require("./schemas");
let CampaignModule = class CampaignModule {
};
exports.CampaignModule = CampaignModule;
exports.CampaignModule = CampaignModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: schema_constants_1.CAMPAIGN, schema: campaign_schema_1.CampaignSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: schema_constants_1.SUBSCRIBER, schema: schemas_1.SubscriberSchema }]),
        ],
        controllers: [campaign_controller_1.CampaignController],
        providers: [campaign_service_1.CampaignService],
        exports: [campaign_service_1.CampaignService],
    })
], CampaignModule);
//# sourceMappingURL=campaign.module.js.map