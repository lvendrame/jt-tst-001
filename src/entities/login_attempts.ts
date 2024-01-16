import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Stylist } from './stylists';

@Entity()
export class LoginAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stylist, stylist => stylist.loginAttempts)
  stylist: Stylist;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ default: false })
  successful: boolean;
}
