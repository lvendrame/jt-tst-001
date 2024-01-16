
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { MaintainSessionDto } from './dto/maintain-session.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('maintain-session')
  async maintainSession(@Body() maintainSessionDto: MaintainSessionDto) {
    return await this.usersService.maintainSession(maintainSessionDto.session_token);
  }
}
