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
    private stylistRepository: StylistRepository, // Keep the stylistRepository from the existing code
  ) {}

  async logFailedLogin(email: string): Promise<void> {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email format');
    }
    // Use the existing code's approach to find the stylist and create the login attempt
    const stylist: Stylist | null = await this.stylistRepository.findStylistByEmail(email);
    const loginAttempt = new LoginAttempt();
    loginAttempt.email = email;
    loginAttempt.success = false;
    loginAttempt.timestamp = new Date().getTime(); // Use new Date().getTime() for consistency with existing code
    loginAttempt.stylist_id = stylist ? stylist : null;
    await this.loginAttemptRepository.save(loginAttempt);
  }

  async logCancellationAttempt(stylistId?: number): Promise<void> {
    const loginAttempt = new LoginAttempt();
    loginAttempt.success = false;
    loginAttempt.timestamp = new Date().getTime(); // Use new Date().getTime() for consistency with existing code
    if (stylistId) {
      // Use the existing code's approach to set the stylist_id
      const stylist: Stylist | null = await this.stylistRepository.findOne(stylistId);
      loginAttempt.stylist_id = stylist ? stylist : null;
    }
    await this.loginAttemptRepository.save(loginAttempt);
  }
}
