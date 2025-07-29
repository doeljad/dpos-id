import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { AuthService } from './auth.service';
import { AuthUser } from '../../types/user-request.interface';
import { Version } from '@nestjs/common';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    const user = await this.authService.register({
      username: body.username,
      password: body.password,
      name: body.name,
      email: body.email,
      tenant_id: body.tenantId,
      branch_id: body.branchId,
      role: body.roleId,
    });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const user = req.user as AuthUser;
    console.log('user from JWT payload:', user);
    return this.authService.getProfile(user.id);
  }
}
