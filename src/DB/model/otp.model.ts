import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { otpType } from 'src/cammon/enume';
import { GenerateHash } from 'src/cammon/security/hash';
import eventEmitter from 'src/cammon/service/email/email.events';
import { hydratedUserDocument } from './user.model';

@Schema({
  timestamps: true,
})
export class otp {
  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: String, required: true })
  code: string;
  @Prop({ type: String, enum: otpType, required: true })
  type: otpType;
  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export type hydratedOtpDocument = HydratedDocument<otp>;
export const otpSchema = SchemaFactory.createForClass(otp);
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre(
  'save',
  async function (
    this: hydratedOtpDocument & { is_New: boolean; plainCode: string },
    next,
  ) {
    if (this.isModified('code')) {
      this.plainCode = this.code;
      this.is_New = this.isNew;
      this.code = await GenerateHash(this.code);
      await this.populate({ path: 'createdBy', select: 'email' });
    }
  },
);

otpSchema.post('save', function (doc, next) {
  const that = doc as unknown as hydratedOtpDocument & {
    is_New: boolean;
    plainCode: string;
  };
  // console.log(doc);
  if (that.is_New) {
    const email = (doc.createdBy as unknown as hydratedUserDocument).email;
    const code = that.plainCode;
    eventEmitter.emit(doc.type, code, email);
  }
  next();
}); 
export const otpModel = MongooseModule.forFeature([
  { name: otp.name, schema: otpSchema },
]);
