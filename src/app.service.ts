import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stylist } from './entities/stylist.entity';
import { LoginAttempt } from './login_attempts/login_attempts.entity';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const NINETY_DAYS_IN_MILLISECONDS = 90 * DAY_IN_MILLISECONDS;

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(LoginAttempt) private loginAttemptRepository: Repository<LoginAttempt>,
    @InjectRepository(Stylist) private stylistRepository: Repository<Stylist>,
  ) {}

  async maintainSession(sessionToken: string): Promise<{ session_maintained: boolean }> {
    if (!sessionToken || sessionToken.trim() === '') {
      return { session_maintained: false };
    }

    const stylist = await this.stylistRepository.findOne({ where: { session_token: sessionToken } });
    if (!stylist || new Date() > stylist.session_expiration) {
      return { session_maintained: false };
    }

    const extension = stylist.keep_session_active ? NINETY_DAYS_IN_MILLISECONDS : DAY_IN_MILLISECONDS;
    stylist.session_expiration = new Date(Date.now() + extension);
    await this.stylistRepository.save(stylist);

    return { session_maintained: true };
  }

  async logCancellationAttempt(): Promise<void> {
    try {
      const loginAttempt = new LoginAttempt();
      loginAttempt.success = false;
      loginAttempt.timestamp = new Date().getTime(); // Current timestamp
      loginAttempt.stylist_id = null; // Stylist ID is not available

      await this.loginAttemptRepository.save(loginAttempt);
    } catch (error) {
      console.error('Error logging cancellation attempt:', error);
      throw error;
    }
  }

  cancelLoginProcess(): { login_cancelled: boolean } {
    // Log the cancellation attempt
    this.logCancellationAttempt();

    console.log('Login process cancelled at timestamp:', new Date().getTime());
    return { login_cancelled: true };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
