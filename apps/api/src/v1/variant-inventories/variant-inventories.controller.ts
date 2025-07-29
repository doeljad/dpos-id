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
import { VariantInventoriesService } from './variant-inventories.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'variant-inventories',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VariantInventoriesController {
  constructor(private readonly service: VariantInventoriesService) {}

  @Permissions(PermissionsCode.VIEW_INVENTORY)
  @Get()
  async getAll(@Request() req) {
    return this.service.findAll(req.user.tenant_id);
  }

  @Permissions(PermissionsCode.CREATE_INVENTORY)
  @Post()
  async create(@Request() req, @Body() data: any) {
    return this.service.create(req.user.tenant_id, data);
  }

  @Permissions(PermissionsCode.UPDATE_INVENTORY)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.service.update(req.user.tenant_id, id, data);
  }

  @Permissions(PermissionsCode.DELETE_INVENTORY)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.service.remove(req.user.tenant_id, id);
  }
}
