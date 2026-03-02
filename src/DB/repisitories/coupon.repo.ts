import { DbRepo } from './db.repo';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Coupon } from '../model/coupon.model';

@Injectable()
export class CouponRepo extends DbRepo {
  constructor(@InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>) {
    super(couponModel);
  }
}
