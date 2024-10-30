"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferModule = void 0;
const common_1 = require("@nestjs/common");
const job_module_1 = require("../job/job.module");
const uploader_module_1 = require("../uploader/uploader.module");
const util_module_1 = require("../util/util.module");
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../constants");
const schemas_1 = require("../job/schemas");
const offer_service_1 = require("./offer.service");
const offer_controller_1 = require("./offer.controller");
const offer_schema_1 = require("./schemas/offer.schema");
let OfferModule = class OfferModule {
};
exports.OfferModule = OfferModule;
exports.OfferModule = OfferModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: constants_1.SCHEMAS.OFFER, schema: offer_schema_1.OfferSchema },
                { name: constants_1.SCHEMAS.JOB_APPLICATION, schema: schemas_1.JobApplicationSchema },
            ]),
            (0, common_1.forwardRef)(() => job_module_1.JobModule),
            uploader_module_1.UploaderModule,
            util_module_1.UtilModule,
        ],
        providers: [offer_service_1.OfferService],
        exports: [offer_service_1.OfferService],
        controllers: [offer_controller_1.OfferController],
    })
], OfferModule);
//# sourceMappingURL=offer.module.js.map