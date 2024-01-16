import { Module } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { StylistsController } from './stylists.controller';
import { SessionMaintenanceController } from './session-maintenance.controller'; // New controller for session maintenance
import { LoginAttemptsService } from '../login_attempts/login_attempts.service'; // Existing service for login attempts

@Module({
  imports: [], // If there are any modules to import, they should be added here.
  providers: [StylistsService, LoginAttemptsService], // Combine providers from both new and existing code
  controllers: [StylistsController, SessionMaintenanceController], // Combine controllers from new code with existing ones
})
export class StylistsModule {}
