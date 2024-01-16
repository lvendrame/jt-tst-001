import { Controller, Post, Body, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { ResetPasswordDto } from './dto/reset-password.dto'; // Assuming ResetPasswordDto exists and matches the requirement
import { UpdateSessionDto } from '../auth/dto/update-session.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { MaintainSessionDto } from './dto/maintain-session.dto'; // Assuming MaintainSessionDto exists

@Controller('stylists')
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Post('/reset-password')
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
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

  // New endpoint added for resetting the password
  @Post('/password/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // Validate the input parameters
    if (!resetPasswordDto.email) {
      throw new BadRequestException('Email is required.');
    }
    if (!resetPasswordDto.token) {
      throw new BadRequestException('Token is required.');
    }
    if (!resetPasswordDto.new_password) {
      throw new BadRequestException('New password is required.');
    }
    // Regex for basic email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(resetPasswordDto.email)) {
      throw new BadRequestException('Invalid email format.');
    }

    try {
      await this.stylistsService.resetPassword(resetPasswordDto);
      return { status: 200, message: 'Password has been reset successfully.' };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to reset password.', error.status || HttpStatus.BAD_REQUEST);
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

  @Post('/update-session-expiry')
  async updateSessionExpiry(@Body() updateSessionDto: UpdateSessionDto) {
    try {
      return await this.stylistsService.updateSessionExpiry(updateSessionDto.session_token, updateSessionDto.keep_session_active);
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update session expiry.', HttpStatus.BAD_REQUEST);
    }
  }
}
