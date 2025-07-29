import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  // GET permissions untuk role
  async getPermissionsByRole(roleId: string) {
    const numericRoleId = parseInt(roleId, 10);

    const permissions = await this.prisma.rolePermission.findMany({
      where: { role_id: numericRoleId },
      include: {
        permission: true,
      },
    });

    return permissions.map((rp) => rp.permission);
  }
  async createPermission(code: string, description: string) {
    return this.prisma.permission.create({
      data: { code, description },
    });
  }
async getAllPermissions() {
  return this.prisma.permission.findMany({
    orderBy: { id: 'asc' },
  });
}

  // PATCH untuk update (replace) semua permission role
  async updatePermissionsForRole(roleId: string, permissionIds: string[]) {
    const numericRoleId = parseInt(roleId, 10);
    const numericPermissionIds = permissionIds.map(id => parseInt(id, 10));

    const role = await this.prisma.role.findUnique({
      where: { id: numericRoleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Hapus semua permission lama
    await this.prisma.rolePermission.deleteMany({
      where: { role_id: numericRoleId },
    });

    // Tambah permission baru
    const data = numericPermissionIds.map((pid) => ({
      role_id: numericRoleId,
      permission_id: pid,
    }));

    await this.prisma.rolePermission.createMany({ data });

    return {
      message: 'Permissions updated successfully',
      permissionIds: numericPermissionIds,
    };
  }

  
  // DELETE semua permission dari role
  async removeAllPermissionsFromRole(roleId: string) {
    const numericRoleId = parseInt(roleId, 10);

    const deleted = await this.prisma.rolePermission.deleteMany({
      where: { role_id: numericRoleId },
    });

    return {
      message: 'Permissions removed successfully',
      deletedCount: deleted.count,
    };
  }

  // POST assign 
async assignPermissions(roleId: string, permissionIds: string[]) {
  const roleIdNum = parseInt(roleId); 
  if (isNaN(roleIdNum)) {
    throw new BadRequestException('Role ID harus berupa angka');
  }

  const permissionIdNums = permissionIds.map((id) => parseInt(id)).filter((id) => !isNaN(id));
  if (permissionIdNums.length !== permissionIds.length) {
    throw new BadRequestException('Semua permission ID harus berupa angka');
  }

  const role = await this.prisma.role.findUnique({
    where: { id: roleIdNum },
  });

  if (!role) {
    throw new NotFoundException('Role tidak ditemukan');
  }

  const validPermissions = await this.prisma.permission.findMany({
    where: { id: { in: permissionIdNums } },
  });

  const validPermissionIds = validPermissions.map((p) => p.id);

  const invalidIds = permissionIdNums.filter((id) => !validPermissionIds.includes(id));
  if (invalidIds.length > 0) {
    throw new BadRequestException(`Permission ID tidak valid: ${invalidIds.join(', ')}`);
  }

  await this.prisma.rolePermission.deleteMany({
    where: { role_id: roleIdNum }, 
  });

  await this.prisma.rolePermission.createMany({
    data: validPermissionIds.map((permissionId) => ({
      role_id: roleIdNum, 
      permission_id: permissionId, 
    })),
  });

  return { message: 'Permissions updated successfully' };
}
}
