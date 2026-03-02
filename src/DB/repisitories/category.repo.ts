import { DbRepo } from './db.repo';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { category } from '../model/category.model';

@Injectable()
export class categoryRepo extends DbRepo {
  constructor(@InjectModel(category.name) private readonly categoryModel: Model<category>) {
    super(categoryModel);
  }
}
