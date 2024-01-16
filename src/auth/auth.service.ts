
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../entities/users.ts';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login({ email, password, keep_session_active }: { email: string; password: string; keep_session_active?: boolean }): Promise<{ session_token: string; token_expiration: Date }> {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid password.');
    }

    const session_token = uuidv4();
    const token_expiration = new Date(Date.now() + (keep_session_active ? 90 : 1) * 24 * 60 * 60 * 1000);
    await this.userRepository.update(user.id, { session_token, token_expiration });

    return { session_token, token_expiration };
  }
}
