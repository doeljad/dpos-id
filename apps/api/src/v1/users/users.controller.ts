import {Controller,Get,Post,Body,Patch,Param,Delete,UseGuards,} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsCode } from '../../common/constants/permissions-code.enum';

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions(PermissionsCode.VIEW_USERS)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Permissions(PermissionsCode.VIEW_USERS)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Permissions(PermissionsCode.UPDATE_USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Permissions(PermissionsCode.DELETE_USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
