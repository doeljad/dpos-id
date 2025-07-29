import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'default_secret',
    });
  }

async validate(payload: any) {
  return {
    id: payload.sub,
    username: payload.username,
    role: payload.role,
    role_id: payload.role_id,
    tenant_id: payload.tenant_id,
    branch_id: payload.branch_id,
  };
}


}
