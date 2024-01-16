import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { StylistsModule } from './stylists/stylists.module';

@Module({
  imports: [AuthModule, StylistsModule], // Combine imports from both versions
  controllers: [AppController, AuthController], // Keep AuthController from existing code
  providers: [AppService, AuthService], // Keep AuthService from existing code
})
export class AppModule {}
