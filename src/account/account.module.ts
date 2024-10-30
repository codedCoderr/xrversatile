import { Module, forwardRef } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UserModule } from '@src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import configuration from '@src/config/env/configuration';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JOB_APPLICATION,
  JOB_OPENING,
  OFFER,
  USER,
} from '@src/constants/schema_constants';
import { UserSchema } from '@src/user/schemas/user.schema';
import { JobOpeningSchema } from '@src/job/schemas';
import { JobApplicationSchema } from '@src/job/schemas/job-application.schema';
import { OfferSchema } from '@src/offer/schemas/offer.schema';
import { AuditLogModule } from '@src/auditlog/auditlog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER, schema: UserSchema },
      { name: JOB_OPENING, schema: JobOpeningSchema },
      { name: JOB_APPLICATION, schema: JobApplicationSchema },
      { name: OFFER, schema: OfferSchema },
    ]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: configuration().jwt.secret,
        signOptions: { expiresIn: configuration().jwt.expiresIn },
      }),
    }),
    AuditLogModule,
  ],
  controllers: [AccountController],
  providers: [LocalStrategy, JwtStrategy, AccountService],
})
export class AccountModule {}
