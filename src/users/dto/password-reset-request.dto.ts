import { IsNotEmpty, IsEmail } from 'class-validator';

export class PasswordResetRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

