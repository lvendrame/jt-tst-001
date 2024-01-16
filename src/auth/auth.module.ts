
import { Module } from '@nestjs/common';
import { PasswordResetTokens } from '/src/stylists/entities/password-reset-token.entity';

@Module({
  imports: [PasswordResetTokens],
  controllers: [],
  providers: [],
})
export class AuthModule {}
