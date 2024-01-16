import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStylistDto } from './dto/login-stylist.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('loginStylist')
  async loginStylist(@Body() loginStylistDto: LoginStylistDto) {
    const { sessionToken, sessionExpiry } = await this.authService.authenticateStylist(
      loginStylistDto.email,
      loginStylistDto.password,
      loginStylistDto.keepSessionActive,
    );
    return { sessionToken, sessionExpiry };
  }
}
