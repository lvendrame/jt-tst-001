import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginAttemptsService } from '../../login_attempts/login_attempts.service';
import { FailedLoginDto } from '../dto/failed-login.dto';

@Controller('stylists')
export class StylistsController {
  constructor(private readonly loginAttemptsService: LoginAttemptsService) {}

  @Post('failed_login') // Updated endpoint to match the requirement
  async logFailedLogin(@Body() failedLoginDto: FailedLoginDto) {
    if (!failedLoginDto.email) {
      throw new HttpException('Email is required.', HttpStatus.BAD_REQUEST);
    }
    await this.loginAttemptsService.logFailedLogin(failedLoginDto.email);
    return { status: HttpStatus.OK, message: 'Failed login attempt has been recorded.' }; // Updated response to match the requirement
  }
}
