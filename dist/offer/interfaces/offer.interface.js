"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferStatuses = exports.OfferStatus = void 0;
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["NotSent"] = "not-sent";
    OfferStatus["Pending"] = "pending";
    OfferStatus["Confirmed"] = "confirmed";
    OfferStatus["Declined"] = "declined";
    OfferStatus["Canceled"] = "canceled";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
exports.OfferStatuses = Object.values(OfferStatus);
//# sourceMappingURL=offer.interface.js.map