import { Module } from '@nestjs/common';
import { VariantOptionValuesController } from './variant-option-values.controller';
import { VariantOptionValuesService } from './variant-option-values.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VariantOptionValuesController],
  providers: [VariantOptionValuesService, PrismaService],
})
export class VariantOptionValuesModule {}
