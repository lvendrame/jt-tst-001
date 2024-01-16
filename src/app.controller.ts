import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MaintainSessionDto } from './dto/maintain-session.dto'; // Assuming MaintainSessionDto exists

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/cancel-login')
  cancelLogin(): { login_cancelled: boolean } {
    return this.appService.cancelLoginProcess();
  }

  @Post('maintain-session')
  async maintainSession(@Body() maintainSessionDto: MaintainSessionDto): Promise<{ session_maintained: boolean }> {
    try {
      return await this.appService.maintainSession(maintainSessionDto.session_token);
    } catch (error) {
      throw new HttpException('Failed to maintain session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
