import { Controller, Get, Patch,Post, Param, Body, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Version } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'tenants',
  version: '1',
})
@UseGuards(JwtAuthGuard,PermissionsGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}
  @Permissions(PermissionsCode.VIEW_TENANTS)
  @Get()
  async getAllTenant() {
    return this.tenantsService.getAllTenant();
  }
  
  @Permissions(PermissionsCode.VIEW_DETAIL_TENANTS)
  @Get(':id')
  async getTenant(@Param('id') id: string) {
    return this.tenantsService.getTenant(id);
  }
  
  @Permissions(PermissionsCode.UPDATE_TENANTS)
  @Patch(':id')
  async updateTenant(@Param('id') id: string, @Body() body: any) {
    return this.tenantsService.updateTenant(id, body);
  }
  
  @Permissions(PermissionsCode.UPDATE_TENANTS)
    @Post()
    async createTenant(@Body() body: CreateTenantDto) {
    return this.tenantsService.createTenant(body);
    }
}
