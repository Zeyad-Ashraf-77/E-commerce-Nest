import { DbRepo } from './db.repo';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Cart } from '../model/cart.model';

@Injectable()
export class CartRepo extends DbRepo {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {
    super(cartModel);
  }
}
