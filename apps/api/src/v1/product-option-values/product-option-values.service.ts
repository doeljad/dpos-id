import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductOptionValuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
    return this.prisma.productOptionValue.findMany({
      where: {
        product_option: { tenant_id },
      },
      include: {
        product_option: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(tenant_id: string, id: string) {
    const value = await this.prisma.productOptionValue.findFirst({
      where: {
        id,
        product_option: { tenant_id },
      },
    });
    if (!value) throw new NotFoundException('Option value tidak ditemukan');
    return value;
  }

  async create(tenant_id: string, data: any) {
    const option = await this.prisma.productOption.findFirst({
      where: { id: data.product_option_id, tenant_id },
    });
    if (!option) throw new NotFoundException('Product option tidak ditemukan');

    return this.prisma.productOptionValue.create({
      data: {
        ...data,
        product_option_id: data.product_option_id,
      },
    });
  }

  async update(tenant_id: string, id: string, data: any) {
    const optionValue = await this.prisma.productOptionValue.findFirst({
      where: {
        id,
        product_option: { tenant_id },
      },
    });
    if (!optionValue) throw new NotFoundException('Option value tidak ditemukan');

    return this.prisma.productOptionValue.update({
      where: { id },
      data,
    });
  }

  async remove(tenant_id: string, id: string) {
    const optionValue = await this.prisma.productOptionValue.findFirst({
      where: {
        id,
        product_option: { tenant_id },
      },
    });
    if (!optionValue) throw new NotFoundException('Option value tidak ditemukan');

    return this.prisma.productOptionValue.delete({ where: { id } });
  }
}
