import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetRequest } from '../entities/password_reset_requests';
import { EmailService } from '../shared/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PasswordResetRequest)
    private passwordResetRequestRepository: Repository<PasswordResetRequest>,
    private emailService: EmailService,
  ) {}

  async maintainSession(sessionToken: string): Promise<any> {
    if (!sessionToken) {
      throw new Error('Session token must not be empty');
    }
    const user = await this.usersRepository.findOne({ where: { session_token: sessionToken } });
    if (!user || user.token_expiration < new Date()) {
      throw new Error('Session has expired');
    }
    const newTokenExpiration = user.keep_session_active ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.usersRepository.update(user.id, { token_expiration: newTokenExpiration });
    return { message: 'Session maintained successfully', newTokenExpiration };
  }

  async requestPasswordReset(passwordResetRequestDto: PasswordResetRequestDto): Promise<{ reset_token: string; token_expiration: Date }> {
    const user = await this.usersRepository.findOne({ where: { email: passwordResetRequestDto.email } });
    if (!user) throw new Error('User not found');

    const reset_token = 'generated-reset-token'; // Replace with actual token generation logic
    const token_expiration = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now

    const passwordResetRequest = this.passwordResetRequestRepository.create({ user_id: user.id, reset_token, token_expiration, status: 'pending' });
    await this.passwordResetRequestRepository.save(passwordResetRequest);

    await this.emailService.sendPasswordResetEmail(user.email, reset_token, token_expiration);

    return { reset_token, token_expiration };
  }
}
