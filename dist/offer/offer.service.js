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
exports.OfferService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants");
const uploader_service_1 = require("../uploader/uploader.service");
const job_1 = require("../job");
const util_1 = require("../util");
const mongoose_2 = require("@nestjs/mongoose");
const offer_interface_1 = require("./interfaces/offer.interface");
let OfferService = class OfferService {
    constructor(offerModel, connection, uploadService, util) {
        this.offerModel = offerModel;
        this.connection = connection;
        this.uploadService = uploadService;
        this.util = util;
    }
    async createOffer(offerDto, user, logger) {
        const session = await this.connection.startSession();
        let offer;
        session.startTransaction();
        logger.info(`db transaction for creating offer for application ${offerDto.application} started`);
        try {
            offerDto.sentBy = user;
            offer = await this.offerModel
                .findOneAndUpdate({ application: offerDto.application }, Object.assign(Object.assign({}, offerDto), { isDeleted: false }), {
                session,
                useFindAndModify: false,
                upsert: true,
                new: true,
            })
                .populate(['job', 'application']);
            const application = await offer.application.populate({
                path: 'agendas',
                populate: 'meeting',
            });
            application.status = job_1.JobApplicationStatus.OfferSent;
            await application.save({ session });
            offer = await this.scriptSignAndSendOffer(offer, logger, session);
            offer.application = application;
            logger.info(`offer created successfully for application ${offerDto.application}`);
            await session.commitTransaction();
            return offer;
        }
        catch (e) {
            await session.abortTransaction();
            throw e;
        }
        finally {
            session.endSession();
        }
    }
    async scriptSignAndSendOffer(offer, logger, session) {
        const pdfStream = await this.util.convertHtmlContentToPdf(offer.content);
        const offerBase64 = await this.util.streamToBase64(pdfStream);
        const upload = await this.uploadService.uploadOfferDocument(offer.job.id, {
            filename: `${offer.id}`,
            size: offerBase64.length,
            mime: 'application/pdf',
            data: offerBase64,
        }, logger);
        await this.offerModel.findOneAndUpdate({ _id: offer.id }, {
            documentUrl: upload.url,
            status: offer_interface_1.OfferStatus.Pending,
        }, {
            useFindAndModify: false,
            new: true,
            session,
        });
        return offer;
    }
    async findOfferByJobApplication(application, logger) {
        logger.info(`finding job offer for application ${application}`);
        return this.offerModel.findOne({
            application,
            isDeleted: false,
        });
    }
    async cancelOffer(offerId, logger, cancelReason, session) {
        logger.info(`Canceling job offer ${offerId}`);
        const offer = await this.offerModel
            .findOneAndUpdate({
            _id: offerId,
            status: { $nin: [offer_interface_1.OfferStatus.Canceled] },
            isDeleted: false,
        }, { status: offer_interface_1.OfferStatus.Canceled, isDeleted: true, cancelReason }, { session })
            .populate('application');
        return offer;
    }
};
exports.OfferService = OfferService;
exports.OfferService = OfferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(constants_1.SCHEMAS.OFFER)),
    __param(1, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Connection,
        uploader_service_1.UploadService,
        util_1.UtilService])
], OfferService);
//# sourceMappingURL=offer.service.js.map