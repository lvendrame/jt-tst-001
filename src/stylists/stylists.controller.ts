import { Controller, Put, Post, Body, HttpCode, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { UpdateSessionDto } from '../../auth/dto/update-session.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { MaintainSessionDto } from './dto/maintain-session.dto';

@Controller('stylists') // Updated to match the new code's route
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Post('reset-password')
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    try {
      const result = await this.stylistsService.requestPasswordReset(requestPasswordResetDto.email);
      return {
        message: 'Password reset email sent successfully.',
        result
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred during password reset.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('password/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    if (!resetPasswordDto.email) {
      throw new BadRequestException('Email is required.');
    }
    if (!resetPasswordDto.token) {
      throw new BadRequestException('Token is required.');
    }
    if (!resetPasswordDto.new_password) {
      throw new BadRequestException('New password is required.');
    }
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

  @Post('maintain-session')
  async maintainSession(@Body() maintainSessionDto: MaintainSessionDto) {
    try {
      return await this.stylistsService.maintainSession(maintainSessionDto.stylist_id, maintainSessionDto.keep_session_active);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('session/update')
  @HttpCode(200)
  async updateSessionExpiry(@Body() updateSessionDto: UpdateSessionDto) {
    if (!updateSessionDto.session_token) {
      throw new HttpException('Session token is required.', HttpStatus.BAD_REQUEST);
    }
    if (typeof updateSessionDto.keep_session_active !== 'boolean') {
      throw new HttpException('Keep session active must be a boolean.', HttpStatus.BAD_REQUEST);
    }
    try {
      const { session_token, keep_session_active } = updateSessionDto;
      const updatedSessionExpiry = await this.stylistsService.updateSessionExpiry(session_token, keep_session_active);
      return updatedSessionExpiry;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ... other existing controller methods ...
}
