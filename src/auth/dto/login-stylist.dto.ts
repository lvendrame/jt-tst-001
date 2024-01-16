import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class LoginStylistDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional() @IsBoolean() keepSessionActive?: boolean;
}
