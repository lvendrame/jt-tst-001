import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { StylistRepository } from './stylist.repository';
import { LoginAttemptsRepository } from './login-attempts.repository';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private stylistRepository: StylistRepository,
    private loginAttemptsRepository: LoginAttemptsRepository
  ) {}

  async authenticateStylist(email: string, password: string, keepSessionActive?: boolean): Promise<{ sessionToken: string }> {
    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    const stylist = await this.stylistRepository.findStylistByEmail(email);
    if (!stylist || !bcrypt.compareSync(password, stylist.password_hash)) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const sessionToken = crypto.randomBytes(64).toString('hex');
    const sessionExpiration = new Date(Date.now() + (keepSessionActive ? 90 : 1) * 24 * 60 * 60 * 1000);

    await this.stylistRepository.updateStylistSession(stylist.id, sessionToken, sessionExpiration);
    await this.loginAttemptsRepository.recordLoginAttempt(stylist.id, true, Date.now());

    return { sessionToken };
  }
}
