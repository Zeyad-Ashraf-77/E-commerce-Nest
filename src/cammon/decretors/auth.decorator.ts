import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthenticationGuard, AuthorizationGuard } from '../guards';
import { TokenType, UserRole } from '../enume';

export function Auth(
  tokenType: TokenType = TokenType.access,
  Roles: UserRole[] = [UserRole.USER],
) {
  return applyDecorators(
    SetMetadata('typeToken', tokenType),
    SetMetadata('access_roles', Roles),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
