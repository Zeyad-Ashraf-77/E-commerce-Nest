import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { TokenService } from '../service/Token';
import { TokenType } from '../enume';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const typeToken = this.reflector.get('typeToken', context.getHandler());

    console.log({type : context.getType()});
    console.log({context:context["contextType"]});
    
    
    let req: any;
    let authorization: string = '';
    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      authorization = req?.headers?.authorization!;
    }else if (context.getType() === 'ws') {
      req = context.switchToWs().getClient();
      authorization = req.handshake.headers['authorization'];
    } else if (context.getType() === 'rpc') {
      req = context.switchToRpc().getData();
      authorization = req.headers['authorization'];
    }

    try {
      const [prefix, token] = authorization?.split(' ') || [];
      if (!prefix || !token) {
        throw new BadRequestException('Invalid token');
      }
      const signature = this.tokenService.GitSignature(
        typeToken as TokenType,
        prefix,
      );
      if (!signature) {
        throw new BadRequestException('Unauthorized');
      }
      const { decoded, user } = await this.tokenService.decodedToken(
        token,
        signature,
      );
      req.user = user;
      req.decoded = decoded;
      return true;
    } catch (error) {
      throw new BadRequestException(error.message || 'Unauthorized');
    }
  }
}
