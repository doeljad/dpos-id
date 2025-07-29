import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, Patch } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Version } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'roles',
  version: '1',
})
@UseGuards(JwtAuthGuard,PermissionsGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}
 
  @Permissions(PermissionsCode.VIEW_ROLES)
  @Get()
  async getAll() {
    return this.rolesService.getAll();
  }
  
  @Permissions(PermissionsCode.CREATE_ROLES)
  @Post()
  async create(@Body() body: { name: string; tenantId?: string }) {
    return this.rolesService.create(body);
  }
  
  @Permissions(PermissionsCode.UPDATE_ROLES)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.rolesService.update(id, body.name);
  }
  
  @Permissions(PermissionsCode.DELETE_ROLES)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
