
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStylistDto } from './dto/login-stylist.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('loginStylist')
  async loginStylist(@Body() loginStylistDto: LoginStylistDto) {
    const { sessionToken } = await this.authService.authenticateStylist(
      loginStylistDto.email,
      loginStylistDto.password,
      loginStylistDto.keep_session_active,
    );
    return { session_token: sessionToken };
  }
}
