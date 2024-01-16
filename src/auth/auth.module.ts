import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAttemptsModule } from '../login_attempts/login_attempts.module';
import { PasswordResetTokens } from '/src/stylists/entities/password-reset-token.entity';

@Module({
  imports: [LoginAttemptsModule, PasswordResetTokens],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
