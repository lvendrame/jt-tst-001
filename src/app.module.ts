import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginAttemptsModule } from './login_attempts/login_attempts.module';
import { StylistsModule } from './stylists/stylists.module';

@Module({
  imports: [LoginAttemptsModule, StylistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
