import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { MaintainSessionDto } from './dto/maintain-session.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/password-reset')
  async requestPasswordReset(@Body() passwordResetRequestDto: PasswordResetRequestDto) {
    return this.usersService.requestPasswordReset(passwordResetRequestDto);
  }

  @Post('maintain-session')
  async maintainSession(@Body() maintainSessionDto: MaintainSessionDto) {
    return await this.usersService.maintainSession(maintainSessionDto.session_token);
  }
}
