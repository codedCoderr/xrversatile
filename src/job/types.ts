export enum JobOpeningStatus {
  Active = 'active',
  Closed = 'closed',
}

export const JobOpeningStatuses = Object.values(JobOpeningStatus);

export enum JobType {
  FullTime = 'full-time',
  Contract = 'contract',
  Internship = 'internship',
  PartTime = 'part-time',
}

export const JobTypes = Object.values(JobType);

export enum JobApplicationStatus {
  Active = 'active',
  Rejected = 'rejected',
  Successful = 'successful',
  Closed = 'closed',
  OfferSent = 'offer-sent',
  OfferSigned = 'offer-signed',
  OfferAccepted = 'offer-accepted',
  OfferRejected = 'offer-rejected',
  OfferCountered = 'offer-countered',
}

export const JobApplicationStatuses = Object.values(JobApplicationStatus);

export enum AgendaType {
  CV = 'cv',
  Interview = 'interview',
  Offer = 'offer',
}

export const AgendaTypes = Object.values(AgendaType);

export enum AgendaStatus {
  Active = 'active',
  Scheduled = 'scheduled',
  Confirmed = 'completed',
  Done = 'done',
}

export const AgendaStatuses = Object.values(AgendaStatus);

export const SalaryRange = {
  from: {
    value: Number,
    currency: String,
  },
  to: {
    value: Number,
    currency: String,
  },
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
