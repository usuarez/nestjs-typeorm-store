// main tools
import { applyDecorators, UseGuards } from '@nestjs/common';

// decorators
import { RoleProtected } from './role-protected.decorator';

// enums
import { validRolesEnum } from '../enums/validRoles';

// guards
import { UserRoleGuard } from '../guards/user-role.guard';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: validRolesEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
