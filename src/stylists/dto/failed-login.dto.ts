import { IsNotEmpty } from 'class-validator';

export class FailedLoginDto {
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;
}
