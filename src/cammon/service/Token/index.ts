import { hydratedUserDocument } from 'src/DB/model/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenType } from 'src/cammon/enume';
import { UserRepo } from 'src/DB/repisitories/user.repo';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepo: UserRepo,
  ) {}
  generateToken = async ({
    payload,
    option,
  }: {
    payload: object;
    option: JwtSignOptions;
  }): Promise<string> => {
    return this.jwtService.signAsync(payload, option);
  };
  verifyToken = async ({
    token,
    options,
  }: {
    token: string;
    options?: JwtVerifyOptions;
  }): Promise<JwtPayload> => {
    return this.jwtService.verifyAsync(token, options) as JwtPayload;
  };
  GitSignature = (tokenType: TokenType = TokenType.access, prefix: string) => {
    if (tokenType === TokenType.access) {
      if (prefix === process.env.JWT_SECRET_ACCESS_USER_prefix) {
        return process.env.JWT_SECRET_ACCESS_USER;
      } else if (prefix === process.env.JWT_SECRET_ACCESS_ADMIN_prefix) {
        return process.env.JWT_SECRET_ACCESS_ADMIN;
      } else {
        return null;
      }
    }
    if (tokenType === TokenType.refresh) {
      if (prefix === process.env.JWT_SECRET_REFRESH_USER_prefix) {
        return process.env.JWT_SECRET_REFRESH_USER;
      } else if (prefix === process.env.JWT_SECRET_REFRESH_ADMIN_prefix) {
        return process.env.JWT_SECRET_REFRESH_ADMIN;
      } else {
        return null;
      }
    }
    return null;
  };
  decodedToken = async (token: string, signature: string) => {
    const decoded = await this.verifyToken({
      token,
      options: { secret: signature },
    });
    if (!decoded) {
      throw new BadRequestException('Unauthorized');
    }
    const user = await this.userRepo.findOne({
      filter: { email: decoded.email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.confirmed) {
      throw new BadRequestException('Please confirm your email');
    }

    // const revokeToken = await _revokeToken.findOne({
    //   filter: { userId: user?._id, tokenId: decoded?.jti! },
    // });
    // if (revokeToken) {
    //   throw new BadRequestException('Token is revoked');
    // }
    // if (user?.changeCredential?.getTime()! > decoded.iat! * 1000) {
    //   throw new BadRequestException('Token is revoked');
    // }
    return { decoded, user };
  };
}
