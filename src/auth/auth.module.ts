import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginAttempt } from '../entities/login_attempts.entity';
import { PasswordResetToken } from '../entities/password_reset_tokens.entity';
import { Stylist } from '../entities/stylists.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginAttempt, PasswordResetToken, Stylist]),
    JwtModule.register({}),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
