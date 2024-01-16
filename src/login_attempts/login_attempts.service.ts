
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAttempt } from './login_attempts.entity';
import { StylistRepository } from '../auth/stylist.repository';
import { Stylist } from '../stylists/stylist.entity';

@Injectable()
export class LoginAttemptsService {
  constructor(
    @InjectRepository(LoginAttempt)
    private loginAttemptRepository: Repository<LoginAttempt>,
    private stylistRepository: StylistRepository,
  ) {}

  async logFailedLogin(email: string): Promise<void> {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email format');
    }
    const stylist: Stylist | null = await this.stylistRepository.findStylistByEmail(email);
    const loginAttempt = new LoginAttempt();
    loginAttempt.email = email;
    loginAttempt.success = false;
    loginAttempt.timestamp = new Date().getTime();
    loginAttempt.stylist_id = stylist ? stylist : null;
    await this.loginAttemptRepository.save(loginAttempt);
  }
}
