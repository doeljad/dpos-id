import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Jika tidak ada permission yang dibutuhkan → lolos
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    // Bypass semua permission jika role SUPER_ADMIN
    if (user.role?.toLowerCase() === 'super_admin') {
      return true;
    }


    if (!user.role_id || !user.role) {
      throw new ForbiddenException(
        'User does not have role_id. Cannot check permissions.',
      );
}



    // Cek permission dari database berdasarkan role_id
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role_id: user.role_id,
        permission: {
          code: {
            in: requiredPermissions,
          },
        },
      },
      select: {
        permission: {
          select: {
            code: true,
          },
        },
      },
    });

    const userPermissionCodes = rolePermissions.map(
      (rp) => rp.permission.code,
    );

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissionCodes.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Missing required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
