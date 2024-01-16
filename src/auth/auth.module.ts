import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // other modules if needed
  ],
  controllers: [
    AuthController, // AuthController is now updated to include the password reset request endpoint
    // other controllers if needed
  ],
  providers: [
    AuthService, // AuthService is now updated to include the method for creating a password reset request
    // other providers if needed
  ],
})
export class AuthModule {}
