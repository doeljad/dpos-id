import {Controller,Get,Post,Patch,Delete,Param,Body,Request,UseGuards,Query,
} from '@nestjs/common';
import { VariantOptionValuesService } from './variant-option-values.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({
  path: 'variant-option-values',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VariantOptionValuesController {
  constructor(private readonly service: VariantOptionValuesService) {}

  @Permissions(PermissionsCode.VIEW_VARIANT_OPTION_VALUES)
  @Get()
  async findAll(@Request() req) {
    return this.service.findAll(req.user.tenant_id);
  }

  @Permissions(PermissionsCode.VIEW_VARIANT_OPTION_VALUES)
  @Get(':variantId/:optionValueId')
  async findOne(
    @Param('variantId') variantId: string,
    @Param('optionValueId') optionValueId: string,
  ) {
    return this.service.findOne(variantId, optionValueId);
  }

  @Permissions(PermissionsCode.CREATE_VARIANT_OPTION_VALUE)
  @Post()
  async create(@Body() body: { product_variant_id: string; product_option_value_id: string }) {
    return this.service.create(body);
  }

  @Permissions(PermissionsCode.DELETE_VARIANT_OPTION_VALUE)
  @Delete(':variantId/:optionValueId')
  async delete(
    @Param('variantId') variantId: string,
    @Param('optionValueId') optionValueId: string,
  ) {
    return this.service.delete(variantId, optionValueId);
  }
}
