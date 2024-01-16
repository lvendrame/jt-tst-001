import { Controller, Post, Body, BadRequestException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email?: string; password?: string; loginDto?: LoginDto }) {
    try {
      let user;
      if (body.loginDto) {
        // Existing code path
        user = await this.authService.login(body.loginDto);
      } else if (body.email && body.password) {
        // New code path
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

  // other handlers...
}
