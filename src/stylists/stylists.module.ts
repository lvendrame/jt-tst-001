import { Module } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { StylistsController } from './stylists.controller';
import { LoginAttemptsService } from '../login_attempts/login_attempts.service';

@Module({
  imports: [], // If there are any modules to import, they should be added here.
  providers: [StylistsService, LoginAttemptsService],
  controllers: [StylistsController],
})
export class StylistsModule {}
