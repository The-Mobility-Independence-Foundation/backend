import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Validates user credentials and retrieves the associated user
   * @param email - The user's email address
   * @param credentials - The user's password or other credentials
   * @returns The authenticated user
   * @throws UnauthorizedException if credentials are invalid
   */
  async validate(email: string, credentials: string): Promise<User> {
    return await this.authService.validateCredentials(email, credentials);
  }
}
