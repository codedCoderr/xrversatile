import { Response } from 'express';
import { Body, Controller, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';

import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { LOGGER } from '@src/constants';
import { ResponseService } from '@src/util';
import { UserDocument } from '@src/user/schemas/user.schema';
import { CurrentUser } from '@src/clients/authentication/authentication.decorators';
import { OfferService } from './offer.service';
import { CreateOfferDTO } from './dto';

@Controller('offer')
export class OfferController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private offerService: OfferService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: {
        service: 'OfferController',
        module: 'Offer',
      },
    });
  }

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendOffer(
    @CurrentUser() currentUser: UserDocument,
    @Body() body: CreateOfferDTO,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const payload = await this.offerService.createOffer(
        body,
        currentUser,
        this.logger,
      );
      return this.responseService.json(
        res,
        200,
        'Offer sent to applicant',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue with sending offer to applicant: ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  // @Post('resend')
  // @UseGuards(JwtAuthGuard)
  // async resendOffer(
  //   @Req() req: Request,
  //   @Body() body: updateOrResendOfferDTO,
  //   @Res() res: Response,
  // ): Promise<any> {
  //   try {
  //     const offer = await this.offerService.findOfferByJobApplication(
  //       (req.user as UserDocument).defaultOrganization as string,
  //       body.application,
  //       this.logger,
  //     );
  //     if (!offer) {
  //       throw new Error('No offer found for this application');
  //     }
  //     if (offer.status === OfferStatus.Confirmed) {
  //       throw new Error('Offer has been confirmed already');
  //     }

  //     const payload = await this.offerService.updateOrResendOffer(
  //       body,
  //       req.user as UserDocument,
  //       this.logger,
  //     );

  //     return this.responseService.json(
  //       res,
  //       200,
  //       'Offer resent to applicant',
  //       payload,
  //     );
  //   } catch (e) {
  //     this.logger.error(`issue with sending offer to applicant: ${e.message}`);
  //     return this.responseService.json(res, e);
  //   }
  // }

  // @Get('/public/action')
  // async fetchOfferOnPublic(
  //   @Res() res: Response,
  //   @Query('token') token: string,
  // ): Promise<any> {
  //   try {
  //     const data = await this.offerService.fetchOfferOnPublic(token);

  //     return this.responseService.json(
  //       res,
  //       200,
  //       'Fetch offer on public page',
  //       data,
  //     );
  //   } catch (e) {
  //     this.logger.error(`issue occur ${e.message}`);
  //     return this.responseService.json(res, e);
  //   }
  // }

  // @Post('/public/reply')
  // async replyOffer(
  //   @Res() res: Response,
  //   @Query('token') token: string,
  //   @Body() body: { action: string; reason: string },
  // ): Promise<any> {
  //   try {
  //     const data = await this.offerService.replyOffer(
  //       token,
  //       body.action,
  //       body.reason,
  //       this.logger,
  //     );

  //     return this.responseService.json(res, 200, 'Updated', data);
  //   } catch (e) {
  //     this.logger.error(`issue occur ${e.message}`);
  //     return this.responseService.json(res, e);
  //   }
  // }
}
