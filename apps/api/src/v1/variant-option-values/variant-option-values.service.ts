import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VariantOptionValuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
  return this.prisma.variantOptionValue.findMany({
    include: {
      product_variant: true,
      product_option_value: true,
    },
  });
}


  async findOne(product_variant_id: string, product_option_value_id: string) {
    const data = await this.prisma.variantOptionValue.findUnique({
      where: {
        product_variant_id_product_option_value_id: {
          product_variant_id,
          product_option_value_id,
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Data variant-option-value tidak ditemukan');
    }

    return data;
  }

  async create(data: { product_variant_id: string; product_option_value_id: string }) {
    return this.prisma.variantOptionValue.create({
      data,
    });
  }

  async delete(product_variant_id: string, product_option_value_id: string) {
    return this.prisma.variantOptionValue.delete({
      where: {
        product_variant_id_product_option_value_id: {
          product_variant_id,
          product_option_value_id,
        },
      },
    });
  }
}
