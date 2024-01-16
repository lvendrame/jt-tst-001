import { Controller, Post, Body, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStylistDto } from './dto/login-stylist.dto';
import { LoginAttemptsService } from '../login_attempts/login_attempts.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginAttemptsService: LoginAttemptsService
  ) {}

  @Post('login_cancel')
  async cancelLoginProcess() {
    await this.loginAttemptsService.logCancellationAttempt();
    return { login_cancelled: true };
  }

  @Post('loginStylist')
  async loginStylist(@Body() loginStylistDto: LoginStylistDto): Promise<any> {
    // Validation for email and password
    if (!loginStylistDto.email) {
      throw new BadRequestException('Email is required.');
    }
    if (!loginStylistDto.password) {
      throw new BadRequestException('Password is required.');
    }
    // Regex pattern for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginStylistDto.email)) {
      throw new BadRequestException('Invalid email format.');
    }

    try {
      const { sessionToken, sessionExpiration } = await this.authService.authenticateStylist(
        loginStylistDto.email,
        loginStylistDto.password,
        loginStylistDto.keep_session_active,
      );
      return {
        status: HttpStatus.OK,
        session_token: sessionToken,
        session_expiration: sessionExpiration.toISOString(),
      };
    } catch (error) {
      await this.loginAttemptsService.logFailedLogin(loginStylistDto.email);
      throw new HttpException('Login failed. Please check your credentials and try again.', HttpStatus.UNAUTHORIZED);
    }
  }
}
