import { Controller, Post, Body, HttpStatus, HttpCode, HttpException, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { MaintainSessionDto } from './dto/maintain-session.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';

@Controller('stylists')
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Post('password_reset')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, exceptionFactory: (errors) => {
    const errorMessages = errors.map(error => Object.values(error.constraints)).join(', ');
    throw new HttpException(errorMessages, HttpStatus.BAD_REQUEST);
  }}))
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
      return { reset_token_sent: false };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('The email is not associated with any stylist account.', HttpStatus.NOT_FOUND);
      } else if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        return { reset_token_sent: false };
      } else if (error instanceof HttpException) {
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

  @Post('maintain_session')
  @HttpCode(HttpStatus.OK)
  async maintainSession(@Body() maintainSessionDto: MaintainSessionDto) {
    try {
      const result = await this.stylistsService.maintainSession(maintainSessionDto);
      if (result.session_maintained) {
        return {
          status: HttpStatus.OK,
          message: 'Session maintained successfully.'
        };
      }
      throw new HttpException('Session maintenance failed', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('session_maintenance')
  @HttpCode(HttpStatus.OK)
  async sessionMaintenance(@Body() maintainSessionDto: MaintainSessionDto) {
    if (!maintainSessionDto.session_token) {
      throw new HttpException('Session token is required.', HttpStatus.BAD_REQUEST);
    }
    if (typeof maintainSessionDto.keep_session_active !== 'boolean') {
      throw new HttpException('Invalid value for keep session active.', HttpStatus.BAD_REQUEST);
    }
    try {
      const newExpiration = await this.stylistsService.updateSessionExpiration(maintainSessionDto);
      return {
        status: HttpStatus.OK,
        session_expiration: newExpiration
      };
    } catch (error) {
      if (error.status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
