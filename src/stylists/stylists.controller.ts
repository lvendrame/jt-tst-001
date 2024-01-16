import { Controller, Post, Body, HttpStatus, HttpCode, HttpException } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';

@Controller('stylists')
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    const result = await this.stylistsService.requestPasswordReset(requestPasswordResetDto.email);
    if (result.reset_token_sent) {
      return result;
    }
    throw new HttpException('Password reset request failed', HttpStatus.BAD_REQUEST);
  }

  @Post('login_cancel')
  @HttpCode(HttpStatus.OK)
  cancelLoginProcess() {
    return {
      status: HttpStatus.OK,
      message: 'You have returned to the previous screen.'
    };
  }
}
