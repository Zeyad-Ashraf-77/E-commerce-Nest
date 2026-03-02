import {
  Injectable,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hydratedUserDocument, user } from 'src/DB/model/user.model';
import type {
  confirmEmailInput,
  loginInput,
  reSendOtpInput,
  SignUpInput,
} from './user.validation/signUp.zod';
import { otpEmail } from 'src/cammon/service/email/sendEmail';
import { UserRepo } from 'src/DB/repisitories/user.repo';
import { OtpRepo } from 'src/DB/repisitories/otp.repo';
import { otpType, UserRole } from 'src/cammon/enume';
import { compareHash, GenerateHash } from 'src/cammon/security/hash';
import { TokenService } from 'src/cammon/service/Token';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { retry } from 'rxjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(user.name) private userModel: Model<user>,
    private readonly userRepo: UserRepo,
    private readonly otpRepo: OtpRepo,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
  ) { }

  private async sendEmail(userId: Types.ObjectId) {
    // await sendEmail({
    //   to: newUser.get('email'),
    //   subject: 'Confirm Email',
    //   text: 'Please confirm your email',
    //   html: templateEmail(otpEmail().toString(), 'Confirm Email'),
    // });
    await this.otpRepo.create({
      createdBy: userId,
      code: otpEmail().toString(),
      type: otpType.CONFIRM_EMAIL,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
    });
  }
  async signUp(body: SignUpInput) {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await GenerateHash(password);
    const newUser = await this.userModel.create({
      ...body,
      password: hashedPassword,
    });
    await this.sendEmail(newUser._id);

    return newUser;
  }
  async reSendOtp(body: reSendOtpInput) {
    const { email } = body;

    let user = await this.userRepo.findOne({
      email,
      confirmed: { $exists: false },
    });
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    // Explicitly populate otp
    user = await user.populate('otp');
    if (Array.isArray(user.otp) && user.otp.length > 0) {
      throw new ConflictException('OTP already sent');
    }
    await this.sendEmail(user._id);

    return {
      message: 'OTP sent successfully',
    };
  }
  async confirmEmail(body: confirmEmailInput) {
    const { email, otp } = body;
    let user = await this.userRepo.findOne({
      email,
      confirmed: { $exists: false },
    });
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    user = await user.populate('otp');
    if (!Array.isArray(user.otp) || !user.otp[0]) {
      throw new ConflictException('No OTP found for this user');
    }
    if (!(await compareHash(otp, user.otp[0].code))) {
      throw new ConflictException('Invalid OTP');
    }
    user.confirmed = true;
    await user.save();
    await this.otpRepo.delete({ _id: user.otp[0]._id });
    return {
      message: 'Email confirmed successfully',
    };
  }
  async login(body: loginInput) {
    const { email, password } = body;
    const user: hydratedUserDocument | null = await this.userRepo.findOne({
      email,
      confirmed: true,
    });
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    if (!(await compareHash(password, user.password))) {
      throw new ConflictException('password or email is incorrect');
    }
    const accessToken = await this.tokenService.generateToken({
      payload: { userId: user._id },
      option: {
        secret:
          user.role === UserRole.USER
            ? process.env.JWT_SECRET_ACCESS_USER!
            : process.env.JWT_SECRET_ACCESS_ADMIN!,
        expiresIn: '1d',
      },
    });
    const refreshToken = await this.tokenService.generateToken({
      payload: { userId: user._id },
      option: {
        secret:
          user.role === UserRole.USER
            ? process.env.JWT_SECRET_REFRESH_USER!
            : process.env.JWT_SECRET_REFRESH_ADMIN!,
        expiresIn: '7d',
      },
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async uploadFile(file: Express.Multer.File, user: hydratedUserDocument) {
    const key = await this.s3Service.uploadFile({
      file,
    });
    console.log("✅ File uploaded to S3 with key:", key);
    // Return the full URL path to access the uploaded file
    const url = `/upload/${key}`;
    console.log("📸 Access URL:", url);
    return url;
  }
}