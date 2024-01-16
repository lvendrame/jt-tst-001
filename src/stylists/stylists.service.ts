
import { Injectable } from '@nestjs/common';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { StylistRepository } from './stylist.repository';
import { PasswordResetTokenRepository } from './password-reset-token.repository';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StylistsService {
  constructor(
    private stylistRepository: StylistRepository,
    private passwordResetTokenRepository: PasswordResetTokenRepository,
    private emailService: EmailService,
  ) {}

  async requestPasswordReset(email: string): Promise<string> {
    // Validate the email using the "RequestPasswordResetDto"
    // This is a placeholder for the actual validation logic
    // ...
    const stylist = await this.stylistRepository.findOne({ where: { email } });
    if (!stylist) {
      throw new Error('Stylist not found');
    }
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
    await this.passwordResetTokenRepository.save({
      stylist_id: stylist.id,
      token: token,
      created_at: new Date(),
      expires_at: expiresAt,
    });
    await this.emailService.sendPasswordResetEmail(stylist.email, token);
    return 'Password reset email sent successfully.';
  }
}
import { InjectRepository } from '@nestjs/typeorm';
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
    // Validate email in controller using DTO
    const stylist = await this.stylistRepository.findOne({ where: { email } });
    if (!stylist) {
      throw new Error('Stylist not found');
    }
    const token = uuidv4();
    const expiry = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
    await this.passwordResetTokenRepository.save({ token, expiry, used: false, stylist_id: stylist.id });
    await this.emailService.sendPasswordResetEmail(email, token);
    return { message: 'Password reset instructions have been sent to your email.' };
  }
}
