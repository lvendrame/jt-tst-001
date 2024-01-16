import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../entities/users';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository
  ) {}

  async validateUser(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Log the attempt here
      throw new UnauthorizedException('Login failed.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      // Log the attempt here
      throw new UnauthorizedException('Login failed.');
    }

    return user;
  }

  async login({ email, password, keep_session_active }: { email: string; password: string; keep_session_active?: boolean }): Promise<{ session_token: string; token_expiration: Date }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const emailRegex = /^\S+@\S+\.\S+$/; // Use the same regex as in validateUser for consistency
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    const user = await this.userService.findByEmail(email); // Use userService to keep consistency with validateUser
    if (!user) {
      throw new UnauthorizedException('User not found.'); // Use UnauthorizedException for consistency
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password.'); // Use UnauthorizedException for consistency
    }

    const session_token = uuidv4();
    const token_expiration = new Date(Date.now() + (keep_session_active ? 90 : 1) * 24 * 60 * 60 * 1000);
    await this.userRepository.update(user.id, { session_token, token_expiration }); // Keep this logic for session management

    return { session_token, token_expiration };
  }
}
