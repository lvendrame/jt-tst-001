import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Stylist } from './stylists';

@Entity()
export class LoginAttempts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stylist_id: number;

  @Column()
  attempted_at: Date;

  @Column()
  successful: boolean;

  @ManyToOne(() => Stylist, stylist => stylist.login_attempts)
  stylist: Stylist;
}
