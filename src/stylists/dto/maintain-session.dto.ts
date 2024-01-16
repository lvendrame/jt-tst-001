import { IsNotEmpty, IsBoolean } from 'class-validator';

export class MaintainSessionDto {
  @IsNotEmpty({ message: 'Session token is required.' })
  session_token: string;

  @IsBoolean()
  keep_session_active: boolean = false;
}

