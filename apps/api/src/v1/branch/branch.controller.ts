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
import { BranchService } from './branch.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'branch',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Permissions(PermissionsCode.VIEW_BRANCHES)
  @Get()
  async getAll(@Request() req) {
    return this.branchService.findAll(req.user.tenant_id);
  }

  @Permissions(PermissionsCode.CREATE_BRANCH)
    @Post()
    create(@Body() data: any) {
    return this.branchService.create(data);
    }


  @Permissions(PermissionsCode.UPDATE_BRANCH)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.branchService.update(req.user.tenant_id, id, data);
  }

  @Permissions(PermissionsCode.DELETE_BRANCH)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.branchService.remove(req.user.tenant_id, id);
  }
}
