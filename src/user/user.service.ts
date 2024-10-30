import { Injectable } from '@nestjs/common';
import { SCHEMAS } from '@src/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { Logger } from '../logger';

@Injectable()
export class UserService {
  private logger: Logger;

  constructor(
    @InjectModel(SCHEMAS.USER)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string, logger: Logger): Promise<UserDocument> {
    logger.info(`finding user by email: ${email}`);

    return this.userModel.findOne({ email, isDeleted: { $ne: true } });
  }

  async findByID(id: string, logger: Logger): Promise<UserDocument> {
    logger.info(`finding user by id: ${id}`);

    return this.userModel.findOne({ _id: id, isDeleted: { $ne: true } });
  }
}
