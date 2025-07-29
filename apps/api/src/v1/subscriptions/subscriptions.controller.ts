import {Body,Controller,Delete,Get,Param,Patch,Post,Put,Request,UseGuards,} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Version } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'subscriptions',
  version: '1',
})
@UseGuards(JwtAuthGuard,PermissionsGuard)
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}
  @Permissions(PermissionsCode.VIEW_SUBSCRIPTIONS)
  @Get()
  async findAll() {
      return this.service.getAll();
    }
    
    @Permissions(PermissionsCode.ME_SUBSCRIPTIONS)
    @Get('me')
    async mySubscription(@Request() req) {
        return this.service.getActiveByTenant(req.user.tenant_id);
    }
    
    @Permissions(PermissionsCode.CREATE_SUBSCRIPTIONS)
    @Post()
    subscribe(@Body() body: any) {
        return this.service.subscribe(body);
    }
    
    @Permissions(PermissionsCode.UPDATE_SUBSCRIPTIONS)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(id, body);
    }
    
    
    @Permissions(PermissionsCode.DELETE_SUBSCRIPTIONS)
    @Delete(':id')
    async cancel(@Param('id') id: string) {
        return this.service.cancel(id);
    }
}
