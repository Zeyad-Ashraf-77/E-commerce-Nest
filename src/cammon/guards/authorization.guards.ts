import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const access_roles = await this.reflector.get(
        'access_roles',
        context.getHandler(),
      );
      const req = context.switchToHttp().getRequest();
      if (!access_roles.includes(req.user.role)) {
        throw new UnauthorizedException();
      } else if (context.getType() === 'ws') {
        const req = context.switchToWs().getClient();
        if (!access_roles.includes(req.user.role)) {
          throw new UnauthorizedException();
        }
      }
      return true;
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Unauthorized');
    }
  }
}
