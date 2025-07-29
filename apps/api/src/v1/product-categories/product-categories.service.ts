import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenant_id: string) {
    return this.prisma.productCategory.findMany({
      where: { tenant_id },
      orderBy: { created_at: 'desc' },
    });
  }

async create(tenant_id: string, data: any) {
  if (!tenant_id) {
    throw new Error('Tenant ID is required');
  }

  return this.prisma.productCategory.create({
    data: {
      name: data.name,
      description: data.description,
      tenant_id: tenant_id,
    },
  });
}


  async update(tenant_id: string, id: string, data: any) {
    const exists = await this.prisma.productCategory.findFirst({
      where: { id, tenant_id },
    });
    if (!exists) throw new NotFoundException('Category not found');

    return this.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async remove(tenant_id: string, id: string) {
    const exists = await this.prisma.productCategory.findFirst({
      where: { id, tenant_id },
    });
    if (!exists) throw new NotFoundException('Category not found');

    return this.prisma.productCategory.delete({ where: { id } });
  }
}
