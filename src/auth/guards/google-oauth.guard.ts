import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for Google OAuth authentication.
 */
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor() {
    super({ accessType: 'offline', prompt: 'consent' });
  }
}
