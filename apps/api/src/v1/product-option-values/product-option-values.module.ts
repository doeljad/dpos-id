import { Module } from '@nestjs/common';
import { ProductOptionValuesController } from './product-option-values.controller';
import { ProductOptionValuesService } from './product-option-values.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProductOptionValuesController],
  providers: [ProductOptionValuesService, PrismaService],
})
export class ProductOptionValuesModule {}
