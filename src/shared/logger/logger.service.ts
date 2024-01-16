import * as fs from 'fs';
import * as path from 'path';

export class LoggerService {
  logFailedLoginAttempt(email: string, timestamp: number): void {
    const logMessage = `Failed login attempt for email: ${email} at ${new Date(timestamp).toISOString()}\n`;
    fs.appendFileSync(path.join(__dirname, '../../../logs/failed_login_attempts.log'), logMessage);
  }
}
