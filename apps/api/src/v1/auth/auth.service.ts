import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

async validateUser(username: string, password: string) {
  const user = await this.prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password_hash: true,
      role: true,
      tenant_id: true,
      role_id: true,
      branch_id: true,
    },
  });

  if (!user) throw new UnauthorizedException('User not found');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new UnauthorizedException('Password incorrect');

  // Kembalikan user lengkap dengan id, tenant_id, role_id
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    role_id: user.role_id,
    tenant_id: user.tenant_id,
    branch_id: user.branch_id,
  };
}


 async login(user: any) {
  // Validasi data penting (kalau belum ada, baru ambil ulang)
  if (!user.id || !user.role || !user.role_id || user.tenant_id === undefined) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
        tenant_id: true,
        role_id: true,
        branch_id: true,
      },
    });

    if (!dbUser) throw new UnauthorizedException('User not found');

    user = {
      ...user,
      id: dbUser.id,
      role: dbUser.role,
      tenant_id: dbUser.tenant_id,
      role_id: dbUser.role_id,
      branch_id: dbUser.branch_id,
    };
  }

const payload = {
  sub: user.id,
  username: user.username,
  role: user.role,
  role_id: user.role_id,
  tenant_id: user.tenant_id ?? null,
  branch_id: user.branch_id ?? null,
};



  return {
    access_token: this.jwt.sign(payload),
  };
}


  async register(data: {
    username: string;
    password: string;
    name: string;
    email: string;
    tenant_id: string;
    branch_id: string;
    role: string;
  }) {
    const { password, ...rest } = data;
    const hashed = await bcrypt.hash(password, 10);

    const role = data.role.toLowerCase();
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error(`Invalid role: ${role}`);
    }

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        email: data.email,
        password_hash: hashed,
        role: role as UserRole,
        ...(role !== 'super_admin' && {
          tenant_id: data.tenant_id,
          branch_id: data.branch_id,
        }),
      },
    });

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        role_id: true,
        tenant_id: true,
        branch_id: true,
        created_at: true,
      },
    });
  }
}
