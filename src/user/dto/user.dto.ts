import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsOptional()
  firstName: string;

  @IsOptional()
  middleName?: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role: string;
}

export class UpdateUserDTO {
  @IsOptional()
  firstName: string;

  @IsOptional()
  middleName?: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  email: string;

  @IsOptional()
  profileImage: string;

  @IsOptional()
  role: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  currentPassword?: string;
}

export class LoginDTO {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;
}

export enum RoleEnum {
  SuperAdmin = 'superadmin',
  Admin = 'admin',
}
