import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserRepo } from 'src/DB/repisitories/user.repo';
import { TokenService } from '../service/Token';
import { userRequest } from '../interfaces';
import { TokenType } from '../enume';

export const tokenType = (typeToken: TokenType = TokenType.access) => {
  return (req: userRequest, res: Response, next: NextFunction) => {
    req.typeToken = typeToken;
    next();
  };
};

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserRepo,
  ) {}
  async use(req: userRequest, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      const [prefix, token] = authorization?.split(' ') || [];
      if (!prefix || !token) {
        throw new BadRequestException('Invalid token');
      }
      const signature = this.tokenService.GitSignature(req.typeToken, prefix);
      if (!signature) {
        throw new BadRequestException('Unauthorized');
      }
      const { decoded, user } = await this.tokenService.decodedToken(
        token,
        signature,
      );
      req.user = user;
      req.decoded = decoded;
      next();
    } catch (error) {
      throw new BadRequestException(error.message || 'Unauthorized');
    }
  }
}
