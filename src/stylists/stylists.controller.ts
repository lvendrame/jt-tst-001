import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { MaintainSessionDto } from './dto/maintain-session.dto'; // Assuming MaintainSessionDto exists

@Controller('stylists')
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Post('/reset-password')
  async resetPassword(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    try {
      const result = await this.stylistsService.requestPasswordReset(requestPasswordResetDto.email);
      return {
        message: 'Password reset email sent successfully.',
        result // Assuming that the result is needed in the response
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred during password reset.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/maintain-session')
  async maintainSession(@Body() maintainSessionDto: MaintainSessionDto) {
    try {
      return await this.stylistsService.maintainSession(maintainSessionDto.stylist_id, maintainSessionDto.keep_session_active);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
