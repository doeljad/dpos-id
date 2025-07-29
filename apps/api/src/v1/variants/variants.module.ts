import { Module } from '@nestjs/common';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VariantsController],
  providers: [VariantsService, PrismaService],
})
export class VariantsModule {}
