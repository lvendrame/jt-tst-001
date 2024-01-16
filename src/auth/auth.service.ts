import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Stylist } from '../entities/stylists';
import * as bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateStylistLogin(loginDto: LoginDto): Promise<{ message: string }> {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    const stylistRepository = getRepository(Stylist);
    const stylist = await stylistRepository.findOne({ where: { email } });

    if (!stylist) {
      throw new HttpException('Login failed. Invalid email or password.', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await bcrypt.compare(password, stylist.password_hash);
    if (!isPasswordMatching) {
      throw new HttpException('Login failed. Invalid email or password.', HttpStatus.UNAUTHORIZED);
    }

    return { message: 'Login successful.' };
  }

  async authenticateStylist(email: string, password: string, keepSessionActive?: boolean): Promise<{ sessionToken: string; sessionExpiry: Date; }> {
    if (!email || !password) {
      throw new HttpException('Email and password must not be empty.', HttpStatus.BAD_REQUEST);
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST);
    }

    const stylistRepository = getRepository(Stylist);
    const stylist = await stylistRepository.findOne({ where: { email } });
    if (!stylist) {
      throw new HttpException('Stylist not found.', HttpStatus.NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, stylist.password_hash);
    if (!passwordMatch) {
      throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
    }

    const sessionToken = this.jwtService.sign({ id: stylist.id });
    const sessionExpiry = new Date(keepSessionActive ? Date.now() + 7776000000 : Date.now() + 86400000);

    await stylistRepository.update(stylist.id, { session_token: sessionToken, session_expiry: sessionExpiry });

    return { sessionToken, sessionExpiry };
  }
}
