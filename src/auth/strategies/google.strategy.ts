import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { ProviderProfile } from '../entities/provider-profile.entity';
import { AuthType } from '../../user/entities/user-auth.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: configService.getOrThrow('GOOGLE_SCOPE'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    // Validate and extract user profile
    const userProfile = this.extractUserProfile(profile);

    // Create provider profile
    const user: ProviderProfile = {
      id: profile.id,
      provider: AuthType.GOOGLE,
      accessToken,
      refreshToken,
      ...userProfile,
    };

    // Return the provider profile
    cb(null, user);
  }

  private extractUserProfile(profile: Profile) {
    if (!profile.name?.givenName || !profile.name?.familyName) {
      throw new UnauthorizedException(
        'Google profile is missing name information',
      );
    }

    if (!profile.emails?.[0]?.value) {
      throw new UnauthorizedException('Google profile is missing email');
    }

    if (!profile.photos?.[0]?.value) {
      throw new UnauthorizedException(
        'Google profile is missing profile photo',
      );
    }

    return {
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      image: profile.photos[0].value,
    };
  }
}
