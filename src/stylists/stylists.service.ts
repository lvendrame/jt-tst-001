
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async requestPasswordReset(email: string): Promise<{ reset_token_sent: boolean }> {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Invalid email address.');
    }
    const stylist = await this.stylistRepository.findOne({ where: { email } });
    if (!stylist) {
      return { reset_token_sent: false };
    }
    const token = randomBytes(32).toString('hex');
    const expiration = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
    await this.passwordResetTokenRepository.save({ stylist_id: stylist.id, token, expires_at: expiration });
    const emailSent = await this.emailService.sendPasswordResetEmail(email, token);
    return { reset_token_sent: emailSent };
  }
}
