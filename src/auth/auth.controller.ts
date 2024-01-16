
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStylistDto } from './dto/login-stylist.dto';
import { LoginAttemptsService } from '../login_attempts/login_attempts.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginAttemptsService: LoginAttemptsService
  ) {}

  @Post('loginStylist')
  async loginStylist(@Body() loginStylistDto: LoginStylistDto) {
    try {
      const { sessionToken } = await this.authService.authenticateStylist(
        loginStylistDto.email,
        loginStylistDto.password,
        loginStylistDto.keep_session_active,
      );
      return { session_token: sessionToken };
    } catch (error) {
      await this.loginAttemptsService.logFailedLogin(loginStylistDto.email);
      throw new HttpException('Login failed. Please check your credentials and try again.', HttpStatus.UNAUTHORIZED);
    }
  }
}
