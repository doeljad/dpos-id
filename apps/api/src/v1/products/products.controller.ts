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
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'products',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Permissions(PermissionsCode.VIEW_PRODUCTS)
  @Get()
  async getAll(@Request() req) {
    return this.productsService.findAll(req.user.tenant_id);
  }

  @Permissions(PermissionsCode.VIEW_PRODUCTS)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string) {
    return this.productsService.findOne(req.user.tenant_id, id);
  }

  @Permissions(PermissionsCode.CREATE_PRODUCT)
  @Post()
  async create(@Request() req, @Body() data: any) {
    return this.productsService.create(req.user.tenant_id, data);
  }

  @Permissions(PermissionsCode.UPDATE_PRODUCT)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.productsService.update(req.user.tenant_id, id, data);
  }

  @Permissions(PermissionsCode.DELETE_PRODUCT)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.productsService.remove(req.user.tenant_id, id);
  }
}
