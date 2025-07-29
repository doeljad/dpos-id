import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Version } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'plans',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}
  @Permissions(PermissionsCode.VIEW_PLANS)
  @Get()
  async findAll() {
    return this.plansService.findAll();
  }
  
  @Permissions(PermissionsCode.CREATE_PLANS)
  @Post()
  async create(@Body() body: any) {
    return this.plansService.create(body);
  }
  
  @Permissions(PermissionsCode.UPDATE_PLANS)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.plansService.update(id, body);
  }
  
  @Permissions(PermissionsCode.DELETE_PLANS)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
