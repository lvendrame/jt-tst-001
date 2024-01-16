import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAttempts } from '../entities/login_attempts.entity';
import { LoginDto } from './dto/login.dto';
import { Stylist } from '../entities/stylists';
import * as bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateStylistLogin(loginDto: LoginDto): Promise<{ message: string }> {
    // This method seems to be unrelated to the new requirement and should remain unchanged.
    ... existing code ...
  }

  async logLoginAttempt(stylistId: number | null, successful: boolean): Promise<LoginAttempts> {
    // This method seems to be unrelated to the new requirement and should remain unchanged.
    ... existing code ...
  }

  async authenticateStylist(email: string, password: string, keepSessionActive?: boolean): Promise<{ sessionToken: string; sessionExpiry: Date; }> {
    // Validation for email and password being blank is updated according to the requirement.
    if (!email) {
      throw new HttpException('Email is required.', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required.', HttpStatus.BAD_REQUEST);
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST);
    }

    const stylistRepository = getRepository(Stylist);
    const stylist = await stylistRepository.findOne({ where: { email } });
    if (!stylist) {
      await this.logLoginAttempt(null, false);
      throw new HttpException('Stylist not found.', HttpStatus.NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, stylist.password_hash);
    if (!passwordMatch) {
      await this.logLoginAttempt(stylist.id, false);
      throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
    }
    stylist.keep_session_active = keepSessionActive;
    const sessionToken = this.jwtService.sign({ id: stylist.id });
    const sessionExpiry = new Date(keepSessionActive ? Date.now() + 7776000000 : Date.now() + 86400000);

    await this.logLoginAttempt(stylist.id, true);
    await stylistRepository.update(stylist.id, { session_token: sessionToken, session_expiry: sessionExpiry });

    return { sessionToken, sessionExpiry };
  }
}
