import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VariantInventoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
    return this.prisma.variantInventory.findMany({
      where: {
        branch: { tenant_id },
      },
      include: {
        branch: true,
        product_variant: true,
      },
    });
  }

  async create(tenant_id: string, data: any) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: data.branch_id, tenant_id },
    });
    if (!branch) throw new NotFoundException('Branch tidak ditemukan');

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: data.product_variant_id },
    });
    if (!variant) throw new NotFoundException('Variant tidak ditemukan');

    return this.prisma.variantInventory.create({
      data: {
        ...data,
      },
    });
  }

  async update(tenant_id: string, id: string, data: any) {
    const inventory = await this.prisma.variantInventory.findFirst({
      where: {
        id,
        branch: { tenant_id },
      },
    });
    if (!inventory) throw new NotFoundException('Inventory tidak ditemukan');

    return this.prisma.variantInventory.update({
      where: { id },
      data,
    });
  }

  async remove(tenant_id: string, id: string) {
    const inventory = await this.prisma.variantInventory.findFirst({
      where: {
        id,
        branch: { tenant_id },
      },
    });
    if (!inventory) throw new NotFoundException('Inventory tidak ditemukan');

    return this.prisma.variantInventory.delete({ where: { id } });
  }
}
