
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
}
