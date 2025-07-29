import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

    async getAllTenant() {
    return this.prisma.tenant.findMany({
        orderBy: { name: 'asc' }, // urut berdasarkan nama
    });
    }


  async getTenant(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async updateTenant(id: string, data: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }
  
  async createTenant(data: any) {
    return this.prisma.tenant.create({
        data,
    });
    }
}
