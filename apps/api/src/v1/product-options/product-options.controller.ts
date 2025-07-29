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
import { ProductOptionsService } from './product-options.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'product-options',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductOptionsController {
  constructor(private readonly service: ProductOptionsService) {}

  @Permissions(PermissionsCode.VIEW_PRODUCT_OPTIONS)
  @Get()
  async getAll(@Request() req) {
    return this.service.findAll(req.user.tenant_id);
  }

  @Permissions(PermissionsCode.VIEW_PRODUCT_OPTIONS)
  @Get(':id')
  async getById(@Request() req, @Param('id') id: string) {
    return this.service.findById(req.user.tenant_id, id);
  }

  @Permissions(PermissionsCode.CREATE_PRODUCT_OPTION)
  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.tenant_id, body);
  }

  @Permissions(PermissionsCode.UPDATE_PRODUCT_OPTION)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.tenant_id, id, body);
  }

  @Permissions(PermissionsCode.DELETE_PRODUCT_OPTION)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.service.remove(req.user.tenant_id, id);
  }
}
