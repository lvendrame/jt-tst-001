import { IsNotEmpty, IsEmail } from 'class-validator';

export class PasswordResetRequestDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;
}
