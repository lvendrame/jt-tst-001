import { IsNotEmpty, IsBoolean } from 'class-validator';

export class MaintainSessionDto {
  @IsNotEmpty({ message: 'Session token is required.' })
  session_token: string;

  @IsBoolean({ message: 'Invalid value for keep session active.' })
  keep_session_active: boolean = false;
}
