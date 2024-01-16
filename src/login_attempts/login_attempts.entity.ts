import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Stylist } from '../stylists/stylist.entity';

@Entity('login_attempts')
export class LoginAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  success: boolean;

  @Column({ type: 'bigint', nullable: false })
  timestamp: number;

  @ManyToOne(() => Stylist, stylist => stylist.loginAttempts)
  stylist_id: Stylist;
}
