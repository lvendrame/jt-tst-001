import { Body, Controller, Post, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
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
    } catch (error: any) {
      await this.authService.logFailedLoginAttempt(loginDto.email);
      throw new HttpException(
        error.message || 'Login attempt failed.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/api/stylists/login')
  async loginStylist(@Body() loginStylistDto: LoginStylistDto): Promise<{ sessionToken: string, sessionExpiry: Date }> {
    // Validation
    if (!loginStylistDto.email) {
      throw new BadRequestException('Email is required.');
    }
    if (!loginStylistDto.email.includes('@')) {
      throw new BadRequestException('Invalid email format.');
    }
    if (!loginStylistDto.password) {
      throw new BadRequestException('Password is required.');
    }

    try {
      const { sessionToken, sessionExpiry } = await this.authService.authenticateStylist(
        loginStylistDto.email,
        loginStylistDto.password,
        loginStylistDto.keepSessionActive,
      );
      return { sessionToken, sessionExpiry };
    } catch (error: any) {
      await this.authService.logFailedLoginAttempt(loginStylistDto.email);
      throw new HttpException(
        error.message || 'Invalid credentials.',
        error.status || HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post('cancelLogin')
  async cancelLogin(): Promise<{ message: string }> {
    return { message: 'Login process canceled successfully.' };
  }
}
