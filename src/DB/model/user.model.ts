import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import {
  UserGender,
  userProvider,
  UserRole,
} from 'src/cammon/enume/user.enume';
import type { hydratedOtpDocument } from './otp.model';
import { HydratedDocument, Types } from 'mongoose';
@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class user {
  @Prop({ type: String, required: true, trim: true })
  fName: string;
  @Prop({ type: String, required: true, trim: true })
  lName: string;
  @Virtual({
    get(this: user) {
      return `${this.fName} ${this.lName}`;
    },
    set(this: user, v: string) {
      this.fName = v.split(' ')[0];
      this.lName = v.split(' ')[1];
    },
  })
  username: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
    required: true,
  })
  role: UserRole;
  @Prop({
    type: String,
    enum: UserGender,
    default: UserGender.MALE,
    required: true,
  })
  gender: UserGender;
  @Prop({ type: String, required: true, trim: true })
  phone: string;
  @Prop({
    type: String,
    enum: userProvider,
    default: userProvider.LOCAL,
    required: true,
  })
  provider: userProvider;
  @Prop({ type: String, required: true, trim: true })
  address: string;
  @Prop({ type: Date, required: true, default: Date.now })
  changeCredentialAt: Date;
  @Prop({ type: Boolean })
  confirmed: boolean;
  @Virtual()
  otp: hydratedOtpDocument;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'product' }] })
  wishlist: Types.ObjectId[];
}

export const userSchema = SchemaFactory.createForClass(user);
userSchema.virtual('otp', {
  ref: 'otp',
  localField: '_id',
  foreignField: 'createdBy',
});
export type hydratedUserDocument = HydratedDocument<user>;
export const userModel = MongooseModule.forFeature([
  { name: user.name, schema: userSchema },
]);
