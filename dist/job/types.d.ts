export declare enum JobOpeningStatus {
    Active = "active",
    Closed = "closed"
}
export declare const JobOpeningStatuses: JobOpeningStatus[];
export declare enum JobType {
    FullTime = "full-time",
    Contract = "contract",
    Internship = "internship",
    PartTime = "part-time"
}
export declare const JobTypes: JobType[];
export declare enum JobApplicationStatus {
    Active = "active",
    Rejected = "rejected",
    Successful = "successful",
    Closed = "closed",
    OfferSent = "offer-sent",
    OfferSigned = "offer-signed",
    OfferAccepted = "offer-accepted",
    OfferRejected = "offer-rejected",
    OfferCountered = "offer-countered"
}
export declare const JobApplicationStatuses: JobApplicationStatus[];
export declare enum AgendaType {
    CV = "cv",
    Interview = "interview",
    Offer = "offer"
}
export declare const AgendaTypes: AgendaType[];
export declare enum AgendaStatus {
    Active = "active",
    Scheduled = "scheduled",
    Confirmed = "completed",
    Done = "done"
}
export declare const AgendaStatuses: AgendaStatus[];
export declare const SalaryRange: {
    from: {
        value: NumberConstructor;
        currency: StringConstructor;
    };
    to: {
        value: NumberConstructor;
        currency: StringConstructor;
    };
};
export interface ParsedCVData {
    name: string;
    email?: string;
    phone?: string;
    experience?: string;
    summary?: string;
    technology?: string;
    education?: string;
    skills?: string;
    languages?: string;
    courses?: string;
    projects?: string;
    links?: string;
    contacts?: string;
    positions?: string;
    profiles?: string;
    linkedIn?: string;
    twitter?: string;
    github?: string;
    portfolio?: string;
    coverLetter?: string;
}
