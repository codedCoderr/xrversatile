import { Logger } from 'winston';
import { ClientSession, Connection, Model } from 'mongoose';
import { UploadService } from '@src/uploader/uploader.service';
import { UtilService } from '@src/util';
import { UserDocument } from '@src/user/schemas/user.schema';
import { OfferDocument } from './interfaces/offer.interface';
import { Offer } from './interfaces';
import { CreateOfferDTO } from './dto';
export declare class OfferService {
    private readonly offerModel;
    private connection;
    private readonly uploadService;
    private util;
    private logger;
    constructor(offerModel: Model<Offer>, connection: Connection, uploadService: UploadService, util: UtilService);
    createOffer(offerDto: CreateOfferDTO, user: UserDocument, logger: Logger): Promise<OfferDocument>;
    scriptSignAndSendOffer(offer: Offer, logger: Logger, session: ClientSession): Promise<Offer>;
    findOfferByJobApplication(application: string, logger: Logger): Promise<Offer>;
    cancelOffer(offerId: string, logger: Logger, cancelReason?: string, session?: ClientSession): Promise<Offer>;
}
