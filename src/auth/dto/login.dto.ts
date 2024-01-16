import { IsNotEmpty, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  keep_session_active?: boolean;
}

