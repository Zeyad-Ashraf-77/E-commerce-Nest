import { DbRepo } from './db.repo';
import { user } from '../model/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepo extends DbRepo {
  constructor(@InjectModel(user.name) private readonly userModel: Model<user>) {
    super(userModel);
  }
}
