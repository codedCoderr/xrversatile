/* eslint camelcase: 0 */

import {
  // BadRequestException,
  // forwardRef,
  // Inject,
  Injectable,
  // NotFoundException,
} from '@nestjs/common';
// import * as pdfreader from 'pdfreader';
import { Logger } from 'winston';
import { ClientSession, Connection, Model } from 'mongoose';
// import { isEmpty, pick } from 'lodash';
// import { Stream } from 'stream';

import { SCHEMAS } from '@src/constants';
// import configuration from '@src/config/env/configuration';
import {
  JobApplication,
  // JobApplicationAgenda,
  JobOpening,
  // JobOpeningDocument,
} from '@src/job/interfaces';
import { UploadService } from '@src/uploader/uploader.service';
import { JobApplicationStatus } from '@src/job';
import { UtilService } from '@src/util';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '@src/user/schemas/user.schema';
import { OfferDocument, OfferStatus } from './interfaces/offer.interface';
import { Offer } from './interfaces';
import { CreateOfferDTO } from './dto';

@Injectable()
export class OfferService {
  private logger: Logger;

  constructor(
    @InjectModel(SCHEMAS.OFFER)
    private readonly offerModel: Model<Offer>,
    @InjectConnection() private connection: Connection,
    private readonly uploadService: UploadService,
    private util: UtilService,
  ) {}

  async createOffer(
    offerDto: CreateOfferDTO,
    user: UserDocument,
    logger: Logger,
  ): Promise<OfferDocument> {
    const session = await this.connection.startSession();
    let offer: Offer;

    session.startTransaction();

    logger.info(
      `db transaction for creating offer for application ${offerDto.application} started`,
    );

    try {
      offerDto.sentBy = user;

      offer = await this.offerModel
        .findOneAndUpdate(
          { application: offerDto.application },
          { ...offerDto, ...{ isDeleted: false } },
          {
            session,
            useFindAndModify: false,
            upsert: true,
            new: true,
          },
        )
        .populate(['job', 'application']);

      /// Update application status
      const application = await (offer.application as JobApplication).populate({
        path: 'agendas',
        populate: 'meeting',
      });

      application.status = JobApplicationStatus.OfferSent;

      await application.save({ session });

      offer = await this.scriptSignAndSendOffer(offer, logger, session);

      offer.application = application;

      logger.info(
        `offer created successfully for application ${offerDto.application}`,
      );

      await session.commitTransaction();

      return offer;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  async scriptSignAndSendOffer(
    offer: Offer,
    logger: Logger,
    session: ClientSession,
  ): Promise<Offer> {
    const pdfStream = await this.util.convertHtmlContentToPdf(offer.content);
    const offerBase64 = await this.util.streamToBase64(pdfStream);

    // const token = this.util.signToJwtToken(
    //   { offerId: offer.id },
    //   { expiresIn: '30d' },
    // );

    const upload = await this.uploadService.uploadOfferDocument(
      (offer.job as JobOpening).id,
      {
        filename: `${offer.id}`,
        size: offerBase64.length,
        mime: 'application/pdf',
        data: offerBase64,
      },
      logger,
    );

    await this.offerModel.findOneAndUpdate(
      { _id: offer.id },
      {
        documentUrl: upload.url,
        status: OfferStatus.Pending,
      },
      {
        useFindAndModify: false,
        new: true,
        session,
      },
    );
    return offer;
  }

  // async updateOrResendOffer(
  //   offerDto: updateOrResendOfferDTO,
  //   user: UserDocument,
  //   logger: Logger,
  // ): Promise<Offer> {
  //   const session = await this.connection.startSession();
  //   let offer: Offer;
  //   session.startTransaction();
  //   logger.info(
  //     `db transaction for updating or/and resend offer for application ${offerDto.application} started`,
  //   );
  //   try {
  //     offerDto.organization = user.defaultOrganization as string;
  //     offerDto.sentBy = user.id;

  //     offer = await this.offerModel
  //       .findOneAndUpdate(
  //         { application: offerDto.application, status: OfferStatus.Pending },
  //         { ...offerDto, ...{ isDeleted: false } },
  //         {
  //           session,
  //           useFindAndModify: false,
  //           upsert: true,
  //           new: true,
  //         },
  //       )
  //       .populate(['job', 'application']);
  //     const [organization, role, hiringTeam] = await Promise.all([
  //       this.organizationService.findOneById(offerDto.organization),
  //       this.deptRoleModel.findOne({
  //         _id: (offer.job as JobOpeningDocument).role,
  //       }),
  //       this.employeeModel.find({
  //         _id: { $in: (offer.job as JobOpeningDocument).hiringTeam },
  //         isDeleted: { $ne: true },
  //       }),
  //     ]);
  //     offer = {
  //       ...('toJSON' in offer ? offer.toJSON() : offer),
  //       organization,
  //     } as OfferDocument;
  //     if (role) {
  //       offer = {
  //         ...('toJSON' in offer ? offer.toJSON() : offer),
  //         job: {
  //           ...(offer.job as JobOpeningDocument),
  //           role: { ...role.toJSON() },
  //         },
  //       } as OfferDocument;
  //     }

  //     if (hiringTeam) {
  //       offer = {
  //         ...('toJSON' in offer ? offer.toJSON() : offer),
  //         job: {
  //           ...(offer.job as JobOpeningDocument),
  //           hiringTeam: hiringTeam.map((c) => c),
  //         },
  //       } as OfferDocument;
  //     }
  //     offer = await this.scriptSignAndSendOffer(offer, logger, session);
  //     logger.info(
  //       `offer updated successfully for application ${offerDto.application}`,
  //     );

  //     await session.commitTransaction();

  //     return offer;
  //   } catch (e) {
  //     await session.abortTransaction();
  //     throw e;
  //   } finally {
  //     session.endSession();
  //   }
  // }

  // async updateOfferFromScriptSignHookPayload(
  //   payload: ScriptSignWebHookPayload,
  //   logger: Logger,
  // ): Promise<Offer> {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();
  //   try {
  //     const { uuid } = payload.envelope;
  //     logger.info(`updating offer with scripsign envelope uuid ${uuid}`);
  //     const offer = await (
  //       await this.findOfferByScriptSignUUID(uuid)
  //     ).populate(['application']);

  //     const sentBy = await this.userModel.findOne({ _id: offer.sentBy });

  //     if (payload.event === 'envelope.completed') {
  //       let application = offer.application as JobApplication;
  //       application = await application.populate('agendas');

  //       /// update Offer Agenda Status to Done
  //       const offerAgenda = (
  //         application.agendas as JobApplicationAgenda[]
  //       ).find((x) => x.type === AgendaType.Offer);
  //       if (offerAgenda) {
  //         offerAgenda.status = AgendaStatus.Done;
  //         await offerAgenda.save({ session });
  //       }

  //       const orgDoc = await this.organizationService.findOneByCriteria(
  //         {
  //           _id: offer.organization as string,
  //           isDeleted: false,
  //         },
  //         ['country'],
  //       );

  //       const country = (orgDoc?.country || {
  //         code: 'NGN',
  //         dialCode: '234',
  //       }) as CountryDocument;

  //       /// Update application status
  //       application.status = JobApplicationStatus.OfferAccepted;
  //       await application.save({ session });
  //       offer.status = OfferStatus.Confirmed;
  //       const { firstname, lastname, email, phonenumber } = application;

  //       let candidateEmail = email.toLocaleLowerCase();
  //       let candidatePhone = phonenumber;

  //       const existingEmailCandidate =
  //         await this.onboardingService.findCandidateByEmail([email]);

  //       const existingPhoneCandidate =
  //         await this.onboardingService.findCandidateByPhonenumber([
  //           phonenumber,
  //         ]);

  //       if (!isEmpty(existingEmailCandidate)) {
  //         candidateEmail = this.util.generateUniqueEmail();
  //       }

  //       if (!isEmpty(existingPhoneCandidate)) {
  //         candidatePhone = this.util.generateUniquePhoneNumber(
  //           country.dialCode,
  //         );
  //       }

  //       const candidate: CreateOnboardingCandidateInput = {
  //         offer: offer.id,
  //         job: offer.job as string,
  //         firstName: firstname,
  //         lastName: lastname,
  //         email: candidateEmail.toLocaleLowerCase(),
  //         phoneNumber: this.util.parsePhonenumber(candidatePhone, country.iso2),
  //         createdBy: sentBy.id,
  //         organization: offer.organization as string,
  //         resumptionDate: offer.resumptionDate,
  //       };

  //       const onboarding = await this.onboardingService.createCandidate(
  //         [candidate],
  //         logger,
  //         session,
  //       );

  //       const { _id: onboardingId } = onboarding.onboarded[0];

  //       const token = this.util.signToJwtToken(
  //         { onboardingId, isFromEmployee: false },
  //         { expiresIn: '30d' },
  //       );

  //       const link = `${
  //         configuration().ui.url
  //       }/public/onboarding/onboard-employee?token=${token}`;

  //       const appDoc = { ...application.toJSON(), organization: orgDoc };

  //       this.templateEngine.sendBeginEmployeeOnboardingEmail({
  //         link,
  //         application: appDoc as JobApplication,
  //       });
  //     }

  //     await offer.save({ session });

  //     logger.info(`done updating offer with id ${offer.id}`);

  //     await session.commitTransaction();

  //     return offer;
  //   } catch (e) {
  //     await session.abortTransaction();
  //     throw e;
  //   } finally {
  //     session.endSession();
  //   }
  // }

  // private async findOfferByScriptSignUUID(uuid: string): Promise<Offer> {
  //   const offer = await this.offerModel
  //     .findOne({ scriptSignUUID: uuid, isDeleted: false })
  //     .populate('job')
  //     .populate('application');
  //   return offer;
  // }

  // private async sendOfferForSigningViaScriptSign(
  //   offer: Offer,
  //   pdfBuffer: Buffer,
  //   logger: Logger,
  // ): Promise<ScriptSignResponse> {
  //   logger.info(`sending offer to applicant via scriptsign`);
  //   const extractedSignatureArea: SignatureCoordinate[] =
  //     await this.extractSignatureCoordinatesFromOffer(pdfBuffer, logger);
  //   const application = offer.application as JobApplication;
  //   const recipents: SignatureObj[] = [
  //     {
  //       name: `${application.firstname} ${application.lastname}`,
  //       email: application.email,
  //       page_number: extractedSignatureArea[0]?.page_number || 1,
  //       x_axis: extractedSignatureArea[0]?.x || 50,
  //       y_axis: extractedSignatureArea[0]?.y || 50,
  //     },
  //   ];
  //   const events: ScriptSignEvent = {
  //     webhook: `${
  //       configuration().api.baseUrl
  //     }offer/scriptsign/hook/completed-signing`,
  //     envelope: ['completed'],
  //     recipient: ['completed'],
  //   };
  //   const data: ScriptSignPostData = {
  //     recipients: recipents,
  //     document_base64: pdfBuffer.toString('base64'),
  //     document_name: `${application.firstname} Offer Letter`,
  //     events,
  //   };
  //   return this.scriptSignService.createEnvelope(data, logger);
  // }

  // private async extractSignatureCoordinatesFromOffer(
  //   buffer: Buffer,
  //   logger: Logger,
  // ): Promise<SignatureCoordinate[]> {
  //   // return [{ x: 1, y: 2, page_number: 2 }];
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const signatureFullMatch = 'applicant_signature';
  //       let lastSignatureItem: PdfReaderItemTextObj;
  //       const signatureCoord: SignatureCoordinate[] = [];
  //       let currentPg: PdfPageObj;
  //       new pdfreader.PdfReader().parseBuffer(
  //         buffer,
  //         (err: Error, item: PdfReaderItemTextObj | PdfPageObj | undefined) => {
  //           if (err) {
  //             logger.error(`pdf reader error: ${err}`);
  //             reject(err);
  //           } else if (!item) {
  //             resolve(signatureCoord);
  //           } else if ((item as any).page) {
  //             currentPg = item as PdfPageObj;
  //           } else if ((item as any).text) {
  //             if ((item as PdfReaderItemTextObj).text !== signatureFullMatch) {
  //               lastSignatureItem = undefined;
  //             } else if (
  //               (item as PdfReaderItemTextObj).text === signatureFullMatch
  //             ) {
  //               lastSignatureItem = item as PdfReaderItemTextObj;
  //               const x = (lastSignatureItem.x * 595.44) / currentPg.width + 10;
  //               const y =
  //                 ((currentPg.height - lastSignatureItem.y) * 841.6) /
  //                   currentPg.height -
  //                 28;
  //               signatureCoord.push({
  //                 x,
  //                 y,
  //                 page_number: currentPg?.page || 1,
  //               });
  //               lastSignatureItem = undefined;
  //             }
  //           }
  //         },
  //       );
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }

  async findOfferByJobApplication(
    application: string,
    logger: Logger,
  ): Promise<Offer> {
    logger.info(`finding job offer for application ${application}`);
    return this.offerModel.findOne({
      application,
      isDeleted: false,
    });
  }

  async cancelOffer(
    offerId: string,
    logger: Logger,
    cancelReason?: string,
    session?: ClientSession,
  ): Promise<Offer> {
    logger.info(`Canceling job offer ${offerId}`);

    const offer = await this.offerModel
      .findOneAndUpdate(
        {
          _id: offerId,
          status: { $nin: [OfferStatus.Canceled] },
          isDeleted: false,
        },
        { status: OfferStatus.Canceled, isDeleted: true, cancelReason },
        { session },
      )
      .populate('application');

    // const application = offer.application as JobApplication;
    // const data = {
    //   name: application.firstname,
    //   email: application.email,
    //   cancelReason,
    // };
    // this.templateEngine.sendOfferTerminatedEmail(data);
    return offer;
  }

  // async replyOffer(
  //   token: string,
  //   action: string,
  //   reason: string,
  //   logger: Logger,
  // ) {
  //   const { offerId } = this.util.verifyJwtToken(token);
  //   const offer = await this.offerModel
  //     .findOne({ _id: offerId })
  //     .populate('application');

  //   const { application } = offer as { application: JobApplication };

  //   const user = await this.userModel.findById(offer.sentBy);

  //   if (!offer) {
  //     throw new NotFoundException('Offer record not found');
  //   }

  //   if (action === 'accepted') {
  //     if (offer.status === OfferStatus.Confirmed) {
  //       throw new BadRequestException('Offer already accepted');
  //     }
  //     if (offer.status === OfferStatus.Declined) {
  //       throw new BadRequestException('Offer already rejected');
  //     }

  //     const offerPayload: ScriptSignWebHookPayload = {
  //       event: 'envelope.completed',
  //       recipients: [
  //         {
  //           created_at: Date.now().toString(),
  //           email: 'email',
  //           has_signed: true,
  //           name: 'name',
  //           signing_url: 'string',
  //           uuid: offer.scriptSignUUID,
  //         },
  //       ],
  //       envelope: {
  //         created_at: Date.now().toString(),
  //         document_name: 'name',
  //         is_complete: true,
  //         uuid: offer.scriptSignUUID,
  //       },
  //     };

  //     await this.updateOfferFromScriptSignHookPayload(offerPayload, logger);

  //     const token = this.util.signToJwtToken(
  //       { id: user.id },
  //       { expiresIn: '30d' },
  //     );
  //     const link = `${
  //       configuration().ui.url
  //     }?path=/talent/onboarding&token=${token}`;

  //     this.templateEngine.replyOfferNotification(
  //       user,
  //       { firstName: application.firstname, lastName: application.lastname },
  //       action,
  //       link,
  //     );
  //   } else if (action === 'rejected') {
  //     if (offer.status === OfferStatus.Declined) {
  //       throw new BadRequestException('Offer already rejected');
  //     }
  //     if (offer.status === OfferStatus.Confirmed) {
  //       throw new BadRequestException('Offer already accepted');
  //     }

  //     await this.offerModel.updateOne(
  //       { _id: offerId },
  //       { $set: { status: OfferStatus.Declined } },
  //     );

  //     const token = this.util.signToJwtToken(
  //       { id: user.id },
  //       { expiresIn: '30d' },
  //     );
  //     const link = `${configuration().ui.url}?path=/talent/hiring/${
  //       application.job
  //     }&token=${token}&tab=offer`;

  //     this.templateEngine.replyOfferNotification(
  //       user,
  //       { firstName: application.firstname, lastName: application.lastname },
  //       action,
  //       link,
  //     );
  //   } else if (action === 'counter') {
  //     if (offer.status === OfferStatus.Confirmed) {
  //       throw new BadRequestException('Offer already accepted');
  //     }
  //     if (offer.status === OfferStatus.Declined) {
  //       throw new BadRequestException('Offer already rejected');
  //     }

  //     await this.jobApplicationModel.findOneAndUpdate(
  //       { _id: application._id },
  //       { status: JobApplicationStatus.OfferCountered },
  //       { useFindAndModify: false },
  //     );

  //     const token = this.util.signToJwtToken(
  //       { id: user.id },
  //       { expiresIn: '30d' },
  //     );
  //     const link = `${configuration().ui.url}?path=/talent/hiring/${
  //       application.job
  //     }&token=${token}&tab=offer`;

  //     this.templateEngine.replyOfferNotification(
  //       user,
  //       { firstName: application.firstname, lastName: application.lastname },
  //       action,
  //       link,
  //       reason,
  //     );
  //   }

  //   return action;
  // }
}
