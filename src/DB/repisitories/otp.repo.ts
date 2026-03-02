import { DbRepo } from './db.repo';
import { otp } from '../model/otp.model';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpRepo extends DbRepo {
  constructor(@InjectModel(otp.name) private readonly otpModel: Model<otp>) {
    super(otpModel);
  }
}
