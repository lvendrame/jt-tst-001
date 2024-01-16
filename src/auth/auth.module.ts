
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // other modules if needed
  ],
  controllers: [
    AuthController,
    // other controllers if needed
  ],
  providers: [
    AuthService,
    // other providers if needed
  ],
})
export class AuthModule {}
