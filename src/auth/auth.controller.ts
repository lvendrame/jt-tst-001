import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginStylistDto } from './dto/login-stylist.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ message: string }> {
    try {
      return await this.authService.validateStylistLogin(loginDto);
    } catch (error) {
      await this.authService.logFailedLoginAttempt(loginDto.email);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('loginStylist')
  async loginStylist(@Body() loginStylistDto: LoginStylistDto): Promise<{ sessionToken: string, sessionExpiry: Date }> {
    try {
      const { sessionToken, sessionExpiry } = await this.authService.authenticateStylist(
        loginStylistDto.email,
        loginStylistDto.password,
        loginStylistDto.keepSessionActive,
      );
      return { sessionToken, sessionExpiry };
    } catch (error) {
      await this.authService.logFailedLoginAttempt(loginStylistDto.email);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cancelLogin')
  async cancelLogin(): Promise<{ message: string }> {
    return { message: 'Login process canceled successfully.' };
  }
}
