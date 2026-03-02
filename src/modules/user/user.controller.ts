import {
  Controller,
  Get,
  ParseFilePipe,
  Patch,
  Request,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/cammon/pipes/zod.pipe';
import type {
  confirmEmailInput,
  loginInput,
  reSendOtpInput,
  SignUpInput,
} from './user.validation/signUp.zod';
import {
  confirmEmailSchema,
  loginSchemaSchema,
  reSendOtpSchema,
  signUpSchema,
} from './user.validation/signUp.zod';
import { UserService } from './user.service';
import type { userRequest } from 'src/cammon/interfaces';
import { AuthenticationGuard, AuthorizationGuard } from 'src/cammon/guards';
import { TokenType, UserRole } from 'src/cammon/enume';
import { Auth } from 'src/cammon/decretors';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { multerLocal } from 'src/cammon/utils/multer';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,private readonly s3Service: S3Service) { }
  @Post()
  signUp(@Body(new ZodValidationPipe(signUpSchema)) body: SignUpInput) {
    return this.userService.signUp(body);
  }

  @Post('resend-otp')
  reSendOtp(
    @Body(new ZodValidationPipe(reSendOtpSchema)) body: reSendOtpInput,
  ) {
    return this.userService.reSendOtp(body);
  }
  @Patch('Confirm-email')
  confirmEmail(
    @Body(new ZodValidationPipe(confirmEmailSchema)) body: confirmEmailInput,
  ) {
    return this.userService.confirmEmail(body);
  }
  @Post('Login')
  login(@Body(new ZodValidationPipe(loginSchemaSchema)) body: loginInput) {
    return this.userService.login(body);
  }
  @Auth()
  @Get('profile')
  profile(@Request() req: userRequest) {
    return { message: 'profile', user: req.user };
    // return this.userService.profile(body);
  }
  @Auth()
  @Post('upload')
  @UseInterceptors(FileInterceptor('attachment', multerLocal(['.jpg', '.jpeg', '.png', '.gif'])))
  async uploadFile(@UploadedFile(ParseFilePipe) file: Express.Multer.File, @Request() req: userRequest) {
    const url = await this.userService.uploadFile(file, req.user);
    return {message:"file uploaded successfully",url};
  }

}
