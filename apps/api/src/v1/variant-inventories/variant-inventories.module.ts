import { Module } from '@nestjs/common';
import { VariantInventoriesController } from './variant-inventories.controller';
import { VariantInventoriesService } from './variant-inventories.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VariantInventoriesController],
  providers: [VariantInventoriesService, PrismaService],
})
export class VariantInventoriesModule {}
