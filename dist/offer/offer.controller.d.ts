import { Response } from 'express';
import { Logger } from 'winston';
import { ResponseService } from '@src/util';
import { UserDocument } from '@src/user/schemas/user.schema';
import { OfferService } from './offer.service';
import { CreateOfferDTO } from './dto';
export declare class OfferController {
    private offerService;
    private responseService;
    private logger;
    constructor(logger: Logger, offerService: OfferService, responseService: ResponseService);
    sendOffer(currentUser: UserDocument, body: CreateOfferDTO, res: Response): Promise<any>;
}
