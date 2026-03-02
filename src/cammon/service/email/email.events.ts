import { EventEmitter } from 'events';
import { sendEmail } from './sendEmail';
import { templateEmail } from './templateEmail';
import { otpType } from 'src/cammon/enume/otp.enum';

const eventEmitter = new EventEmitter();

eventEmitter.on(otpType.CONFIRM_EMAIL, (otp: string, email: string) => {
  void sendEmail({
    to: email,
    subject: 'Confirm Email',
    text: 'Please confirm your email',
    html: templateEmail(otp, otpType.CONFIRM_EMAIL.toString()),
  });
});
eventEmitter.on(otpType.FORGET_PASSWORD, (otp: string, email: string) => {
  void sendEmail({
    to: email,
    subject: 'Forget Password',
    text: 'Please confirm your email',
    html: templateEmail(otp, otpType.FORGET_PASSWORD.toString()),
  });
});

export default eventEmitter;
