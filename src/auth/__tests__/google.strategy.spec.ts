import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from '../strategies/google.strategy';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { AuthType } from '../../user/entities/user-auth.entity';
import { Profile } from 'passport';

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
        emails: [{ value: 'test@test.com' }],
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
        id: '123',
        provider: AuthType.GOOGLE,
        accessToken,
        refreshToken,
        displayName: profile.displayName,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        email: profile.emails?.[0]?.value,
        image: profile.photos?.[0]?.value,
      });
    });

    it('should handle missing optional fields', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        emails: [{ value: 'test@test.com' }],
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
        id: '123',
        provider: AuthType.GOOGLE,
        accessToken,
        refreshToken,
        displayName: profile.displayName,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        email: profile.emails?.[0]?.value,
        image: undefined,
      });
    });

    it('should throw BadRequestException if name information is missing', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        emails: [{ value: 'test@test.com' }],
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

      expect(cb).toHaveBeenCalledWith(expect.any(BadRequestException));
    });

    it('should throw BadRequestException if email is missing', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
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

      expect(cb).toHaveBeenCalledWith(expect.any(BadRequestException));
    });

    it('should throw BadRequestException if emails array is empty', async () => {
      const profile: Partial<Profile> = {
        id: '123',
        displayName: 'John Doe',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        emails: [],
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

      expect(cb).toHaveBeenCalledWith(expect.any(BadRequestException));
    });
  });
});
