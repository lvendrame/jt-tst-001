
import { Module } from '@nestjs/common';
import { StylistsController, StylistsService } from './stylists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stylist } from '../entities/stylists';
import { PasswordResetToken } from '../entities/password_reset_tokens';

@Module({
  imports: [TypeOrmModule.forFeature([Stylist, PasswordResetToken])],
  controllers: [StylistsController], // StylistsController is already included
  providers: [StylistsService], // Added StylistsService to the providers array
})
export class StylistsModule {}
