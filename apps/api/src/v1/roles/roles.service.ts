import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.role.findMany();
  }

  async create(data: { name: string; tenantId?: string }) {
    return this.prisma.role.create({ data });
  }

  async update(id: string, name: string) {
    const roleId = parseInt(id, 10); 
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    return this.prisma.role.update({
      where: { id: roleId },
      data: { name },
    });
  }

  async remove(id: string) {
    const roleId = parseInt(id, 10);
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    if ((role as any).tenantId === null) {
      throw new Error('Cannot delete system default role');
    }

    return this.prisma.role.delete({ where: { id: roleId } });
  }
}
