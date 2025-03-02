import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, credentials: string) {
    const user = await this.authService.validateCredentials(email, credentials);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
