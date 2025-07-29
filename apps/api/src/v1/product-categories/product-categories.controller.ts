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
import { ProductCategoriesService } from './product-categories.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'product-categories',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @Permissions(PermissionsCode.VIEW_PRODUCT_CATEGORIES)
  @Get()
  async getAll(@Request() req) {
    return this.service.findAll(req.user.tenant_id);
  }

  @Permissions(PermissionsCode.CREATE_PRODUCT_CATEGORY)
    @Post()
    create(@Request() req, @Body() body) {
    const tenant_id = req.user.tenant_id; // dari JWT
    return this.service.create(tenant_id, body);
    }


  @Permissions(PermissionsCode.UPDATE_PRODUCT_CATEGORY)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.service.update(req.user.tenant_id, id, data);
  }

  @Permissions(PermissionsCode.DELETE_PRODUCT_CATEGORY)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.service.remove(req.user.tenant_id, id);
  }
}
