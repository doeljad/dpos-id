import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductOptionValuesService } from './product-option-values.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'product-option-values',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductOptionValuesController {
  constructor(private readonly service: ProductOptionValuesService) {}

  @Permissions(PermissionsCode.VIEW_PRODUCT_OPTION_VALUES)
  @Get()
  async findAll(@Request() req) {
    return this.service.findAll(req.user.tenant_id);
  }

  @Permissions(PermissionsCode.VIEW_PRODUCT_OPTION_VALUES)
  @Get(':id')
  async findById(@Request() req, @Param('id') id: string) {
    return this.service.findById(req.user.tenant_id, id);
  }

  @Permissions(PermissionsCode.CREATE_PRODUCT_OPTION_VALUE)
  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.tenant_id, body);
  }

  @Permissions(PermissionsCode.UPDATE_PRODUCT_OPTION_VALUE)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.tenant_id, id, body);
  }

  @Permissions(PermissionsCode.DELETE_PRODUCT_OPTION_VALUE)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.service.remove(req.user.tenant_id, id);
  }
}
