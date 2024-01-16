
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';

@Controller('stylists')
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Post('/reset-password')
  async resetPassword(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    try {
      const result = await this.stylistsService.requestPasswordReset(requestPasswordResetDto.email);
      return {
        message: 'Password reset email sent successfully.'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred during password reset.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
