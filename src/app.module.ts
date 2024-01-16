import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StylistsModule } from './stylists/stylists.module';

@Module({
  imports: [StylistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
