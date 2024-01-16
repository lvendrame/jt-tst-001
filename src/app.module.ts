import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { StylistsModule } from './stylists/stylists.module';

@Module({
  imports: [StylistsModule],
  controllers: [AppController, AuthController], // Added AuthController
  providers: [AppService, AuthService], // Added AuthService
})
export class AppModule {}
