import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Stylist } from '../entities/stylists';
import { PasswordResetToken } from '../entities/password_reset_tokens';
import { v4 as uuidv4 } from 'uuid';
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

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const stylist = await this.stylistRepository.findOne({ where: { email } });
    if (!stylist) {
      throw new HttpException('Stylist not found', HttpStatus.NOT_FOUND);
    }
    const token = uuidv4();
    const expiry = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
    await this.passwordResetTokenRepository.save({ token, expiry, used: false, stylist_id: stylist.id });
    await this.emailService.sendPasswordResetEmail(email, token);
    return { message: 'Password reset instructions have been sent to your email.' };
  }

  async maintainSession(stylistId: string, keepSessionActive: boolean): Promise<{ message: string }> {
    const stylist = await this.stylistRepository.findOne(stylistId);
    if (!stylist) {
      throw new HttpException('Stylist not found', HttpStatus.NOT_FOUND);
    }
    const ninetyDaysInMilliseconds = 90 * 24 * 60 * 60 * 1000;
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
    const newSessionExpiry = new Date(Date.now() + (keepSessionActive ? ninetyDaysInMilliseconds : twentyFourHoursInMilliseconds));
    await this.stylistRepository.update(stylistId, { session_expiry: newSessionExpiry });
    return { message: 'Session maintenance updated successfully.' };
  }

  async resetPassword(email: string, token: string, new_password: string): Promise<{ message: string }> {
    if (!email) {
      throw new HttpException('Email is required.', HttpStatus.BAD_REQUEST);
    }
    if (!token) {
      throw new HttpException('Token is required.', HttpStatus.BAD_REQUEST);
    }
    if (!new_password) {
      throw new HttpException('New password is required.', HttpStatus.BAD_REQUEST);
    }

    const passwordResetToken = await this.passwordResetTokenRepository.findOne({
      where: { token, used: false },
      relations: ['stylist'],
    });

    if (!passwordResetToken || passwordResetToken.expiry < new Date()) {
      throw new HttpException('Invalid or expired password reset token', HttpStatus.UNAUTHORIZED);
    }

    if (passwordResetToken.stylist.email !== email) {
      throw new HttpException('Email does not match the requested reset', HttpStatus.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.stylistRepository.update(passwordResetToken.stylist.id, { password_hash: hashedPassword });
    await this.passwordResetTokenRepository.update(passwordResetToken.id, { used: true });

    return { message: 'Password has been reset successfully.' };
  }

  async updateSessionExpiry(sessionToken: string, keepSessionActive: boolean): Promise<{ message: string }> {
    const stylist = await this.stylistRepository.findOne({ where: { session_token: sessionToken } });
    if (!stylist) {
      throw new HttpException('Stylist not found', HttpStatus.NOT_FOUND);
    }
    const newExpiryDuration = keepSessionActive ? 90 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const newSessionExpiry = new Date(Date.now() + newExpiryDuration);
    await this.stylistRepository.update(stylist.id, { session_expiry: newSessionExpiry });
    return { message: 'Session expiry updated successfully.' };
  }
}
