import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'permissions',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permissions(PermissionsCode.ASSIGN_PERMISSIONS)
  @Post('assign')
  async assignPermissions(@Body() body: { roleId: string; permissionIds: string[] }) {
    return this.permissionsService.assignPermissions(body.roleId, body.permissionIds);
  }

  @Permissions(PermissionsCode.VIEW_PERMISSIONS)
  @Get(':roleId')
  async getPermissionsByRole(@Param('roleId') roleId: string) {
    return this.permissionsService.getPermissionsByRole(roleId);
  }

  @Permissions(PermissionsCode.UPDATE_PERMISSIONS)
  @Patch(':roleId')
  async updatePermissionsForRole(
    @Param('roleId') roleId: string,
    @Body() body: { permissionIds: string[] },
  ) {
    return this.permissionsService.updatePermissionsForRole(roleId, body.permissionIds);
  }

  @Permissions(PermissionsCode.DELETE_PERMISSIONS)
  @Delete(':roleId')
  async removeAllPermissionsFromRole(@Param('roleId') roleId: string) {
    return this.permissionsService.removeAllPermissionsFromRole(roleId);
  }

  @Permissions(PermissionsCode.CREATE_PERMISSIONS)
  @Post()
  async createPermission(
    @Body() body: { code: string; description: string }
  ) {
    return this.permissionsService.createPermission(body.code, body.description);
  }

  @Permissions(PermissionsCode.VIEW_PERMISSIONS)
  @Get()
  async getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }
}
