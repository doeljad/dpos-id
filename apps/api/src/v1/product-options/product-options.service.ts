import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductOptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
    return this.prisma.productOption.findMany({
      where: { tenant_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(tenant_id: string, id: string) {
    const option = await this.prisma.productOption.findFirst({
      where: { id, tenant_id },
    });
    if (!option) throw new NotFoundException('Product option tidak ditemukan');
    return option;
  }

  async create(tenant_id: string, data: any) {
    return this.prisma.productOption.create({
      data: {
        ...data,
        tenant_id,
      },
    });
  }

  async update(tenant_id: string, id: string, data: any) {
    const option = await this.prisma.productOption.findFirst({
      where: { id, tenant_id },
    });
    if (!option) throw new NotFoundException('Product option tidak ditemukan');

    return this.prisma.productOption.update({
      where: { id },
      data,
    });
  }

  async remove(tenant_id: string, id: string) {
    const option = await this.prisma.productOption.findFirst({
      where: { id, tenant_id },
    });
    if (!option) throw new NotFoundException('Product option tidak ditemukan');

    return this.prisma.productOption.delete({ where: { id } });
  }
}
