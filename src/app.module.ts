import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginAttemptsModule } from './login_attempts/login_attempts.module';
import { StylistsModule } from './stylists/stylists.module'; // Corrected module name and path

@Module({
  imports: [LoginAttemptsModule, StylistsModule], // Corrected module name in imports array
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
