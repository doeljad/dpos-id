import { Module } from '@nestjs/common';
import { ProductOptionsController } from './product-options.controller';
import { ProductOptionsService } from './product-options.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProductOptionsController],
  providers: [ProductOptionsService, PrismaService],
})
export class ProductOptionsModule {}
