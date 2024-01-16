import { EntityRepository, Repository } from 'typeorm';
import { Stylist } from '../entities/stylist.entity';

@EntityRepository(Stylist)
export class StylistRepository extends Repository<Stylist> {

  async findStylistByEmail(email: string): Promise<Stylist | undefined> {
    return this.findOne({ where: { email } });
  }

  async updateStylistSession(stylistId: number, sessionToken: string, sessionExpiration: Date): Promise<void> {
    await this.update(stylistId, {
      session_token: sessionToken,
      session_expiration: sessionExpiration,
    });
  }

}
