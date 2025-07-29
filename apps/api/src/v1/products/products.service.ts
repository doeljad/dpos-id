import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
    return this.prisma.product.findMany({
      where: { tenant_id },
      orderBy: { created_at: 'desc' },
    });
  }
  async findOne(tenant_id: string, id: string) {
    if (!tenant_id) throw new Error('tenant_id is required');

    return this.prisma.product.findFirst({
      where: {
        id,
        tenant_id,
      },
    });
  }

  async create(tenant_id: string, data: any) {
    return this.prisma.product.create({
      data: {
        ...data,
        tenant_id,
      },
    });
  }

  async update(tenant_id: string, id: string, data: any) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenant_id },
    });

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(tenant_id: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenant_id },
    });

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.delete({ where: { id } });
  }
}
