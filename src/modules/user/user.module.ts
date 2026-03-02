import { user, userSchema } from './../../DB/model/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpRepo } from 'src/DB/repisitories/otp.repo';
import { UserRepo } from 'src/DB/repisitories/user.repo';
import { otp, otpSchema } from 'src/DB/model/otp.model';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/cammon/service/Token';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: otp.name, schema: otpSchema }]),

  ],
  controllers: [UserController],
  providers: [UserService, UserRepo, OtpRepo, JwtService, TokenService, S3Service],
  exports: [TokenService, JwtService, UserRepo, MongooseModule],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(tokenType(), AuthenticationMiddleware)
  //     .forRoutes({ path: 'users/*demo', method: RequestMethod.ALL });
  // }
}
