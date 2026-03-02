import { DbRepo } from './db.repo';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Product } from '../model/product.model';

@Injectable()
export class ProductRepo extends DbRepo {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {
    super(productModel);
  }
}
