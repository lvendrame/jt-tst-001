import { Controller, Post, Body, BadRequestException, UnauthorizedException, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto'; // This import is not used in the code

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email?: string; password?: string; loginDto?: LoginDto }) {
    try {
      let user;
      if (body.loginDto) {
        user = await this.authService.login(body.loginDto);
      } else if (body.email && body.password) {
        user = await this.authService.validateUser(body.email, body.password);
      } else {
        throw new BadRequestException('Invalid request body');
      }
      // TODO: Generate and return JWT token or any other response required for successful login
      return user;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        return error.message;
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        // Handle other types of exceptions that might occur
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Post('login/stylist')
  @HttpCode(HttpStatus.OK)
  async loginStylist(@Body() loginDto: LoginDto) {
    if (!loginDto.email) {
      throw new HttpException('Email is required.', HttpStatus.BAD_REQUEST);
    }
    if (!loginDto.password) {
      throw new HttpException('Password is required.', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.authService.login(loginDto);
      return {
        status: HttpStatus.OK,
        message: 'Login successful',
        session_token: user.session_token,
        token_expiration: user.token_expiration,
      };
    } catch (error) {
      if (error.status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException('An unexpected error occurred on the server.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post('/login/cancel')
  cancelLogin(): any {
    try {
      // Business logic for cancelling the login process can be implemented here
      return {
        statusCode: 200,
        message: 'Login process cancelled successfully',
      };
    } catch (error) {
      throw new HttpException('An unexpected error occurred on the server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('password_reset/stylist')
  async requestPasswordReset(@Body() body: { email?: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required.');
    }
    if (!this.validateEmailFormat(body.email)) {
      throw a BadRequestException('Invalid email format.');
    }
    try {
      const response = await this.authService.requestPasswordReset({ email: body.email });
      return {
        status: HttpStatus.OK,
        message: 'Password reset request successful',
        reset_token: response.reset_token,
        token_expiration: response.token_expiration
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to process password reset request.',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ... other handlers from existing code if any ...
}
