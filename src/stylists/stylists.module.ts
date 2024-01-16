import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StylistsController } from './stylists.controller';
import { StylistsService } from './stylists.service';
import { Stylist } from '../entities/stylists';
import { PasswordResetToken } from '../entities/password_reset_tokens';

@Module({
  imports: [TypeOrmModule.forFeature([Stylist, PasswordResetToken])],
  controllers: [StylistsController],
  providers: [StylistsService],
})
export class StylistsModule {}
