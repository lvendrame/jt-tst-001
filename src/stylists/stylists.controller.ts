import { Controller, Post, Body, HttpStatus, HttpCode, HttpException } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';

@Controller('stylists')
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Post('password_reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    if (!requestPasswordResetDto.email) {
      throw new HttpException('Email is required.', HttpStatus.BAD_REQUEST);
    }
    if (!this.validateEmail(requestPasswordResetDto.email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.stylistsService.requestPasswordReset(requestPasswordResetDto.email);
      if (result.reset_token_sent) {
        return {
          status: HttpStatus.OK,
          message: 'Password reset email sent successfully.'
        };
      }
      throw new HttpException('Password reset request failed', HttpStatus.BAD_REQUEST);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('The email is not associated with any stylist account.', HttpStatus.NOT_FOUND);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login_cancel')
  @HttpCode(HttpStatus.OK)
  cancelLoginProcess() {
    return {
      status: HttpStatus.OK,
      message: 'You have returned to the previous screen.'
    };
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
