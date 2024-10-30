"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryRange = exports.AgendaStatuses = exports.AgendaStatus = exports.AgendaTypes = exports.AgendaType = exports.JobApplicationStatuses = exports.JobApplicationStatus = exports.JobTypes = exports.JobType = exports.JobOpeningStatuses = exports.JobOpeningStatus = void 0;
var JobOpeningStatus;
(function (JobOpeningStatus) {
    JobOpeningStatus["Active"] = "active";
    JobOpeningStatus["Closed"] = "closed";
})(JobOpeningStatus || (exports.JobOpeningStatus = JobOpeningStatus = {}));
exports.JobOpeningStatuses = Object.values(JobOpeningStatus);
var JobType;
(function (JobType) {
    JobType["FullTime"] = "full-time";
    JobType["Contract"] = "contract";
    JobType["Internship"] = "internship";
    JobType["PartTime"] = "part-time";
})(JobType || (exports.JobType = JobType = {}));
exports.JobTypes = Object.values(JobType);
var JobApplicationStatus;
(function (JobApplicationStatus) {
    JobApplicationStatus["Active"] = "active";
    JobApplicationStatus["Rejected"] = "rejected";
    JobApplicationStatus["Successful"] = "successful";
    JobApplicationStatus["Closed"] = "closed";
    JobApplicationStatus["OfferSent"] = "offer-sent";
    JobApplicationStatus["OfferSigned"] = "offer-signed";
    JobApplicationStatus["OfferAccepted"] = "offer-accepted";
    JobApplicationStatus["OfferRejected"] = "offer-rejected";
    JobApplicationStatus["OfferCountered"] = "offer-countered";
})(JobApplicationStatus || (exports.JobApplicationStatus = JobApplicationStatus = {}));
exports.JobApplicationStatuses = Object.values(JobApplicationStatus);
var AgendaType;
(function (AgendaType) {
    AgendaType["CV"] = "cv";
    AgendaType["Interview"] = "interview";
    AgendaType["Offer"] = "offer";
})(AgendaType || (exports.AgendaType = AgendaType = {}));
exports.AgendaTypes = Object.values(AgendaType);
var AgendaStatus;
(function (AgendaStatus) {
    AgendaStatus["Active"] = "active";
    AgendaStatus["Scheduled"] = "scheduled";
    AgendaStatus["Confirmed"] = "completed";
    AgendaStatus["Done"] = "done";
})(AgendaStatus || (exports.AgendaStatus = AgendaStatus = {}));
exports.AgendaStatuses = Object.values(AgendaStatus);
exports.SalaryRange = {
    from: {
        value: Number,
        currency: String,
    },
    to: {
        value: Number,
        currency: String,
    },
};
//# sourceMappingURL=types.js.map