import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '@src/clients/authentication/guards/local-auth.guard';
import { LOGGER } from '@src/constants';
import { Logger } from 'winston';
import { Response } from 'express';
import { clone } from 'lodash';

import { CurrentUser } from '@src/shared/decorators';
import {
  CreateUserDTO,
  ResetPasswordDTO,
  UpdateUserDTO,
} from '@src/user/dto/user.dto';
import { UserDocument } from '@src/user/schemas/user.schema';
import { ResponseService } from '@src/util/response.service';
import { JwtAuthGuard } from '@src/clients/authentication/guards/jwt-auth.guard';
import { FileUploadDTO } from '@src/uploader/dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  private logger: Logger;

  constructor(
    @Inject(LOGGER) logger: Logger,
    private accountService: AccountService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: {
        service: 'AccountController',
        module: 'Account',
      },
    });
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/create-admin')
  async createAdmin(
    @Res() res: Response,
    @Body() body: CreateUserDTO,
    @CurrentUser() user: UserDocument,
  ): Promise<any> {
    try {
      const payload = await this.accountService.createAdmin(
        body,
        user,
        this.logger,
      );

      return this.responseService.json(
        res,
        200,
        'Admin created successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue creating admin ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Res() res: Response,
    @CurrentUser() user: UserDocument,
  ): Promise<any> {
    try {
      const payload = await this.accountService.login(user, this.logger);

      return this.responseService.json(
        res,
        200,
        'Login was successful',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue logging in ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getLoggedInAdmin(
    @Res() res: Response,
    @CurrentUser() user: UserDocument,
  ) {
    try {
      const payload = await this.accountService.getLoggedInAdmin(
        user,
        this.logger,
      );
      return this.responseService.json(
        res,
        200,
        'Loggged in admin details was fetched successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(
        `issue fetching logged in admin's details ${e.message}`,
      );
      return this.responseService.json(res, e);
    }
  }

  @Get('/admins')
  @UseGuards(JwtAuthGuard)
  async getAdmins(
    @Res() res: Response,
    @Query()
    input: {
      perPage: number;
      page: number;
    },
  ) {
    try {
      const { perPage, page } = input;

      const payload = await this.accountService.getAdmins(
        this.logger,
        page,
        perPage,
      );
      return this.responseService.json(
        res,
        200,
        'Admins fetched successfully',
        payload.data,
        payload.metadata,
      );
    } catch (e) {
      this.logger.error(`issue fetching admins ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Put('/user')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Res() res: Response,
    @CurrentUser() user: UserDocument,
    @Body() body: UpdateUserDTO,
  ) {
    try {
      const payload = await this.accountService.updateProfile(
        user,
        body,
        this.logger,
      );
      return this.responseService.json(
        res,
        200,
        'User profile was updated successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue updating user profile ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Put('/admin/:id')
  @UseGuards(JwtAuthGuard)
  async updateAdmin(
    @Res() res: Response,
    @CurrentUser() currentUser: UserDocument,
    @Body() body: Partial<UpdateUserDTO>,
    @Param() param: { id: string },
  ) {
    try {
      const user = clone(currentUser) as UserDocument;

      const payload = await this.accountService.updateAdmin(
        user,
        param.id,
        body,
        this.logger,
      );
      return this.responseService.json(
        res,
        200,
        'Admin detail was updated successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue updating admin details ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/admin/:id/delete')
  async deleteAdmin(
    @Res() res: Response,
    @Param() param: { id: string },
    @CurrentUser() currentUser: UserDocument,
  ): Promise<any> {
    try {
      const user = clone(currentUser) as UserDocument;

      await this.accountService.deleteAdmin(user, param.id, this.logger);

      return this.responseService.json(res, 204, 'Successfully deleted admin');
    } catch (e) {
      this.logger.error(`issue deleting admin ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Put('/reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Res() res: Response,
    @CurrentUser() user: UserDocument,
    @Body() body: ResetPasswordDTO,
  ) {
    try {
      const payload = await this.accountService.resetPassword(
        user,
        body,
        this.logger,
      );
      return this.responseService.json(res, 200, payload.message);
    } catch (e) {
      this.logger.error(`issue resetting password ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Get('/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Res() res: Response) {
    try {
      const payload = await this.accountService.getStats(this.logger);
      return this.responseService.json(
        res,
        200,
        'Dashboard stats fetched successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue fetching dashboard stats ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Get('/job-engagement-overview')
  @UseGuards(JwtAuthGuard)
  async getJobEngagementOverview(@Res() res: Response) {
    try {
      const payload = await this.accountService.fetchJobEngagementOverview(
        this.logger,
      );
      return this.responseService.json(
        res,
        200,
        'Job engagement overview was fetched successfully',
        payload,
      );
    } catch (e) {
      this.logger.error(`issue fetching job engagement overview ${e.message}`);
      return this.responseService.json(res, e);
    }
  }

  @Post('/profile-image')
  @UseGuards(JwtAuthGuard)
  async uploadProfileImage(@Res() res: Response, @Body() body: FileUploadDTO) {
    try {
      const payload = await this.accountService.uploadFile(body);
      return this.responseService.json(res, 200, payload as any);
    } catch (e) {
      this.logger.error(`issue uploading profile image ${e.message}`);
      return this.responseService.json(res, e);
    }
  }
}
