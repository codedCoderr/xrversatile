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
exports.OfferController = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const constants_1 = require("../constants");
const util_1 = require("../util");
const authentication_decorators_1 = require("../clients/authentication/authentication.decorators");
const offer_service_1 = require("./offer.service");
const dto_1 = require("./dto");
let OfferController = class OfferController {
    constructor(logger, offerService, responseService) {
        this.offerService = offerService;
        this.responseService = responseService;
        this.logger = logger.child({
            context: {
                service: 'OfferController',
                module: 'Offer',
            },
        });
    }
    async sendOffer(currentUser, body, res) {
        try {
            const payload = await this.offerService.createOffer(body, currentUser, this.logger);
            return this.responseService.json(res, 200, 'Offer sent to applicant', payload);
        }
        catch (e) {
            this.logger.error(`issue with sending offer to applicant: ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
};
exports.OfferController = OfferController;
__decorate([
    (0, common_1.Post)('send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, authentication_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateOfferDTO, Object]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "sendOffer", null);
exports.OfferController = OfferController = __decorate([
    (0, common_1.Controller)('offer'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        offer_service_1.OfferService,
        util_1.ResponseService])
], OfferController);
//# sourceMappingURL=offer.controller.js.map