
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAttempts } from '../entities/login_attempts.entity';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    // other imports...
    LoginAttempts,
  ],
})
export class AuthModule {}
