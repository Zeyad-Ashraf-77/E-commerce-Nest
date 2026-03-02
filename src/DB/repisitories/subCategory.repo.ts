import { DbRepo } from './db.repo';
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { subCategory } from '../model/subCategory.model';

@Injectable()
export class subCategoryRepo extends DbRepo {
  constructor(@InjectModel(subCategory.name) private readonly subCategoryModel: Model<subCategory>) {
    super(subCategoryModel);
  }
}
