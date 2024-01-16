
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginAttemptsService } from './login_attempts.service';

@Controller('login-attempts')
export class LoginAttemptsController {
  constructor(private readonly loginAttemptsService: LoginAttemptsService) {}

  @Post()
  async handleFailedLogin(@Body('email') email: string): Promise<{ message: string }> {
    await this.loginAttemptsService.logFailedLogin(email);
    throw new HttpException('Login failed. Please check your credentials and try again.', HttpStatus.UNAUTHORIZED);
  }
}
