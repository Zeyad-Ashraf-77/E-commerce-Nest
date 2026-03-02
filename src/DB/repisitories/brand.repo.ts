import { DbRepo } from './db.repo';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Brand } from '../model/brand.model';

@Injectable()
export class BrandRepo extends DbRepo {
  constructor(@InjectModel(Brand.name) private readonly brandModel: Model<Brand>) {
    super(brandModel);
  }
}
