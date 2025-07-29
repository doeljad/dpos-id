import { PartialType } from '@nestjs/mapped-types'; 
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username: string;

  password: string;

  name: string;
  email?: string;

  role_id: number;

  tenant_id: string;
}

