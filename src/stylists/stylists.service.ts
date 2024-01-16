
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaintainSessionDto } from './dto/maintain-session.dto'; // Added import
import { Repository } from 'typeorm';
import { Stylist } from './entities/stylist.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class StylistsService {
  constructor(
    @InjectRepository(Stylist)
    private stylistRepository: Repository<Stylist>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    private emailService: EmailService,
  ) {}

  async requestPasswordReset(email: string): Promise<{ status: number; message: string }> {
    if (!email) {
      throw new HttpException('Email is required.', HttpStatus.BAD_REQUEST);
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST);
    }
    const stylist = await this.stylistRepository.findOne({ where: { email } });
    if (!stylist) {
      throw new HttpException('The email is not associated with any stylist account.', HttpStatus.NOT_FOUND);
    }
    const token = randomBytes(32).toString('hex');
    const expiration = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
    await this.passwordResetTokenRepository.save({ stylist_id: stylist.id, token, expires_at: expiration });
    const emailSent = await this.emailService.sendPasswordResetEmail(email, token);
    if (emailSent) {
      return { status: HttpStatus.OK, message: 'Password reset email sent successfully.' };
    } else {
      throw new HttpException('Failed to send password reset email.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async maintainSession(maintainSessionDto: MaintainSessionDto): Promise<{ session_maintained: boolean }> {
    const { session_token, keep_session_active } = maintainSessionDto;
    if (!session_token) {
      throw new HttpException('Session token is required.', HttpStatus.BAD_REQUEST);
    }
    const stylist = await this.stylistRepository.findOne({ where: { session_token } });
    if (!stylist) {
      return { session_maintained: false };
    }
    const currentTime = new Date();
    if (stylist.session_expiration > currentTime) {
      const newExpiration = new Date(
        currentTime.getTime() + (keep_session_active ? 90 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
      );
      stylist.session_expiration = newExpiration;
      await this.stylistRepository.save(stylist);
      return { session_maintained: true };
    } else {
      return { session_maintained: false };
    }
  }

  // Other methods...
}
