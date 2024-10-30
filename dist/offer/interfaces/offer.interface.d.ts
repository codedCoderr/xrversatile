import { JobApplication, JobOpening } from '@src/job/interfaces';
import { UserDocument } from '@src/user/schemas/user.schema';
import { CurrencyAmount } from '@src/util/index';
import { Document } from 'mongoose';
export declare enum OfferStatus {
    NotSent = "not-sent",
    Pending = "pending",
    Confirmed = "confirmed",
    Declined = "declined",
    Canceled = "canceled"
}
export declare const OfferStatuses: OfferStatus[];
export interface Offer extends Document {
    application: JobApplication;
    job: JobOpening;
    sentBy: UserDocument;
    readonly content: string;
    readonly updatedAt: Date;
    readonly createdAt: Date;
    documentUrl?: string;
    deletedAt?: Date;
    isDeleted?: boolean;
    scriptSignUUID?: string;
    salaryAmount?: CurrencyAmount;
    resumptionDate?: Date;
    status: OfferStatus;
    cancelReason?: string;
}
export type OfferDocument = Offer & Document;
