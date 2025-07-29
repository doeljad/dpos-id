import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
    return this.prisma.productVariant.findMany({
      where: {
        product: {
          tenant_id,
        },
      },
      include: {
        product: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(tenant_id: string, data: any) {
    const product = await this.prisma.product.findFirst({
      where: { id: data.product_id, tenant_id },
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');

    return this.prisma.productVariant.create({
      data: {
        ...data,
        product_id: data.product_id,
      },
    });
  }

  async update(tenant_id: string, id: string, data: any) {
    const variant = await this.prisma.productVariant.findFirst({
      where: {
        id,
        product: { tenant_id },
      },
    });
    if (!variant) throw new NotFoundException('Varian tidak ditemukan');

    return this.prisma.productVariant.update({
      where: { id },
      data,
    });
  }

  async remove(tenant_id: string, id: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: {
        id,
        product: { tenant_id },
      },
    });
    if (!variant) throw new NotFoundException('Varian tidak ditemukan');

    return this.prisma.productVariant.delete({ where: { id } });
  }
}
