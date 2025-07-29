import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
    return this.prisma.branch.findMany({
      where: { tenant_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(data: any) {
    if (!data.tenant_id) {
        throw new BadRequestException('tenant_id is required');
    }

    return this.prisma.branch.create({
        data: {
        tenant_id: data.tenant_id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        status: data.status || 'active',
        },
    });
    }



  async update(tenant_id: string, id: string, data: any) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, tenant_id },
    });

    if (!branch) throw new NotFoundException('Branch not found');

    return this.prisma.branch.update({
      where: { id },
      data,
    });
  }

  async remove(tenant_id: string, id: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, tenant_id },
    });

    if (!branch) throw new NotFoundException('Branch not found');

    return this.prisma.branch.delete({ where: { id } });
  }
}
