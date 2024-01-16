import { EntityRepository, Repository } from 'typeorm';
import { Stylist } from '../entities/stylist.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity'; // Added import for PasswordResetToken

@EntityRepository(Stylist)
export class StylistRepository extends Repository<Stylist> {

  async findStylistByEmail(email: string): Promise<Stylist | null> {
    return this.findOne({ where: { email } });
  }

  async updateStylistSession(stylistId: number, sessionToken: string, sessionExpiration: Date): Promise<void> {
    await this.update(stylistId, {
      session_token: sessionToken,
      session_expiration: sessionExpiration,
    });
  }

  // Added new method from the new code
  async storePasswordResetToken(stylistId: number, token: string, createdAt: Date, expiresAt: Date): Promise<void> {
    const passwordResetToken = this.create({
      stylist_id: stylistId,
      token: token,
      created_at: createdAt,
      expires_at: expiresAt
    });
    await this.save(passwordResetToken);
  }

}
