import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthProviderProfile } from '../entities/auth-provider-profile.entity';
import { AuthType } from '../../user/entities/user-auth.entity';
import { Profile } from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: configService.getOrThrow('GOOGLE_SCOPE'),
    });
  }

  /**
   * Validates the Google OAuth profile and creates an AuthProviderProfile
   * @param accessToken - The OAuth access token
   * @param refreshToken - The OAuth refresh token
   * @param profile - The Google profile information
   * @param cb - The verification callback
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<void> {
    try {
      const userProfile = this.extractUserProfile(profile);

      const user: AuthProviderProfile = {
        id: profile.id,
        provider: AuthType.GOOGLE,
        accessToken,
        refreshToken,
        ...userProfile,
      };

      cb(null, user);
    } catch (error) {
      cb(error);
    }
  }

  /**
   * Extracts user profile information from Google profile
   * @param profile - The Google profile
   * @returns The extracted user profile information
   * @throws BadRequestException if email or names are missing
   */
  private extractUserProfile(profile: Profile): {
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  } {
    if (!profile.name || !profile.name.givenName || !profile.name.familyName) {
      throw new BadRequestException(
        'Google profile is missing name information',
      );
    }

    if (!profile.emails || !profile.emails[0]?.value) {
      throw new BadRequestException(
        'Google profile is missing email information',
      );
    }

    return {
      displayName: profile.displayName,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      email: profile.emails[0].value,
      image: profile.photos?.[0]?.value,
    };
  }
}
