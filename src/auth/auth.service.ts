import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Stylist } from 'src/entities/stylists';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async authenticateStylist(email: string, password: string, keepSessionActive?: boolean): Promise<{ sessionToken: string; sessionExpiry: Date; }> {
    if (!email || !password) {
      throw new Error('Email and password must not be empty.');
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }

    const stylist = await Stylist.findOne({ where: { email } });
    if (!stylist) {
      throw new Error('Stylist not found.');
    }

    const passwordMatch = await bcrypt.compare(password, stylist.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid password.');
    }

    const sessionToken = this.jwtService.sign({ id: stylist.id });
    const sessionExpiry = new Date(keepSessionActive ? Date.now() + 7776000000 : Date.now() + 86400000);

    await Stylist.update(stylist.id, { session_token: sessionToken, session_expiry: sessionExpiry });

    return { sessionToken, sessionExpiry };
  }
}
