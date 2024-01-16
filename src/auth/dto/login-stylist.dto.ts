import { IsNotEmpty, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class LoginStylistDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsOptional()
  @IsBoolean()
  keep_session_active?: boolean;
}
