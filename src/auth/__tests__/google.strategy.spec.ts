import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from '../strategies/google.strategy';
import { createMock } from '@golevelup/ts-jest';
import { UnauthorizedException } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { AuthType } from '../../user/entities/user-auth.entity';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleStrategy],
    })
      .useMocker(createMock)
      .compile();

    strategy = module.get(GoogleStrategy);
  });

  describe('validate', () => {
    it('should validate and extract user profile successfully', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        emails: [{ value: 'test@test.com', verified: true }],
        photos: [{ value: 'https://example.com/photo.jpg' }],
      };

      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';
      const cb = jest.fn();

      await strategy.validate(
        accessToken,
        refreshToken,
        profile as Profile,
        cb,
      );

      expect(cb).toHaveBeenCalledWith(null, {
        id: profile.id,
        provider: AuthType.GOOGLE,
        accessToken,
        refreshToken,
        displayName: profile.displayName,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        email: profile.emails?.[0].value,
        image: profile.photos?.[0].value,
      });
    });

    it('should call callback with error if name information is missing', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        emails: [{ value: 'test@test.com', verified: true }],
        photos: [{ value: 'https://example.com/photo.jpg' }],
      };

      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';
      const cb = jest.fn();

      await strategy.validate(
        accessToken,
        refreshToken,
        profile as Profile,
        cb,
      );

      expect(cb).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    });

    it('should call callback with error if email is missing', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        photos: [{ value: 'https://example.com/photo.jpg' }],
      };

      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';
      const cb = jest.fn();

      await strategy.validate(
        accessToken,
        refreshToken,
        profile as Profile,
        cb,
      );

      expect(cb).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    });

    it('should call callback with error if profile photo is missing', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        emails: [{ value: 'test@test.com', verified: true }],
      };

      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';
      const cb = jest.fn();

      await strategy.validate(
        accessToken,
        refreshToken,
        profile as Profile,
        cb,
      );

      expect(cb).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    });
  });
});
