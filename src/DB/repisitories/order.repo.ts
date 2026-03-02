import { DbRepo } from './db.repo';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Order } from '../model/order.model';

@Injectable()
export class OrderRepo extends DbRepo {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {
    super(orderModel);
  }
}
