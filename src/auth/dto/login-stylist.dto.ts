import { IsNotEmpty } from 'class-validator';

export class LoginStylistDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  keep_session_active?: boolean;
}
