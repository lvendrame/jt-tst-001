
import { EntityRepository, Repository } from 'typeorm';
import { LoginAttempt } from './login-attempt.entity';

@EntityRepository(LoginAttempt)
export class LoginAttemptsRepository extends Repository<LoginAttempt> {

  async recordLoginAttempt(stylistId: number, success: boolean, timestamp: Date): Promise<void> {
    const loginAttempt = this.create({
      stylist_id: stylistId,
      success: success,
      attempt_time: timestamp
    });
    await this.save(loginAttempt);
  }

}
