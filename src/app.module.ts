import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StylistModule } from './stylist/stylist.module'; // Assuming StylistModule exists

@Module({
  imports: [StylistModule], // Add StylistModule to imports if it exists
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
