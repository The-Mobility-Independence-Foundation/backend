import { Repository } from 'typeorm';
import { UserAuthService } from '../user-auth.service';
import { UserAuth, AuthType } from '../entities/user-auth.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { ValidationException } from '../../common/exceptions/validation.exception';
import { ProviderProfile } from 'src/auth/entities/provider-profile.entity';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('UserAuthService', () => {
  let service: UserAuthService;
  let userAuthRepository: Repository<UserAuth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: getRepositoryToken(UserAuth),
          useValue: createMock<Repository<UserAuth>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(UserAuthService);
    userAuthRepository = module.get(getRepositoryToken(UserAuth));
  });

  describe('findByIdentifier', () => {
    it('should find a user auth by email', async () => {
      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: userAuth.identifier },
          relations: { user: true },
        })
        .mockResolvedValue(userAuth);

      const result = await service.findByIdentifier(userAuth.identifier);

      expect(result).toBeDefined();
      expect(result).toBe(userAuth);
    });

    it('should find a user auth by email with additional where conditions', async () => {
      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';
      userAuth.type = AuthType.LOCAL;

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: userAuth.identifier, type: userAuth.type },
          relations: { user: true },
        })
        .mockResolvedValue(userAuth);

      const result = await service.findByIdentifier(userAuth.identifier, {
        where: { type: userAuth.type },
      });

      expect(result).toBeDefined();
      expect(result).toBe(userAuth);
    });

    it('should find a user auth by email regardless of the case of the email', async () => {
      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: userAuth.identifier },
          relations: { user: true },
        })
        .mockResolvedValue(userAuth);

      const result = await service.findByIdentifier(
        userAuth.identifier.toUpperCase(),
      );

      expect(result).toBeDefined();
      expect(result).toBe(userAuth);
    });

    it('should return null if the user auth is not found', async () => {
      const identifier = 'test@test.com';

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier },
          relations: { user: true },
        })
        .mockResolvedValue(null);

      const result = await service.findByIdentifier(identifier);

      expect(result).toBeNull();
    });
  });

  describe('initializeLocalAuth', () => {
    it('should initialize a local auth record', async () => {
      const userAuth = await service.initializeLocalAuth(
        'TEST@TEST.COM',
        'Password123!',
      );

      expect(userAuth).toBeDefined();
      expect(userAuth.identifier).toBe('test@test.com');
      expect(userAuth.type).toBe(AuthType.LOCAL);
      expect(userAuth.credentials).toBeDefined();
      expect(userAuth.credentials).not.toBe('Password123!');
      expect(userAuth.providerAccountId).not.toBeDefined();
      expect(userAuth.refreshToken).not.toBeDefined();
      expect(userAuth.accessToken).not.toBeDefined();
    });

    it('should throw a validation exception if the email is invalid', async () => {
      await expect(
        service.initializeLocalAuth('invalid-email', 'Password123!'),
      ).rejects.toThrow(ValidationException);
    });

    it('should throw a validation exception if the password is invalid', async () => {
      await expect(
        service.initializeLocalAuth('test@test.com', 'invalid-password'),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('initializeProviderAuth', () => {
    it('should initialize a provider auth record', async () => {
      const providerProfile: ProviderProfile = {
        id: '123',
        email: 'TEST@TEST.COM',
        provider: AuthType.GOOGLE,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/image.png',
      };

      const userAuth = await service.initializeProviderAuth(providerProfile);

      expect(userAuth).toBeDefined();
      expect(userAuth.identifier).toBe('test@test.com');
      expect(userAuth.type).toBe(AuthType.GOOGLE);
      expect(userAuth.providerAccountId).toBe('123');
      expect(userAuth.refreshToken).toBe('refreshToken');
      expect(userAuth.accessToken).toBe('accessToken');
      expect(userAuth.credentials).not.toBeDefined();
    });

    it('should throw a validation exception if the email is invalid ', async () => {
      const providerProfile: ProviderProfile = {
        id: '123',
        email: 'invalid-email',
        provider: AuthType.GOOGLE,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/image.png',
      };

      await expect(
        service.initializeProviderAuth(providerProfile),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('validateCredentials', () => {
    it('should validate the credentials of a local auth record', async () => {
      const credentials = 'Password123!';

      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';
      userAuth.credentials = await bcrypt.hash(credentials, 10);
      userAuth.type = AuthType.LOCAL;
      userAuth.user = new User();

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: userAuth.identifier, type: userAuth.type },
          relations: { user: true },
        })
        .mockResolvedValue(userAuth);

      const result = await service.validateCredentials(
        userAuth.identifier,
        credentials,
      );

      expect(result).toBeDefined();
      expect(result).toBe(userAuth.user);
    });

    it('should throw a bad request exception if the user auth is not found', async () => {
      const identifier = 'test@test.com';
      const credentials = 'Password123!';

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier, type: AuthType.LOCAL },
          relations: { user: true },
        })
        .mockResolvedValue(null);

      await expect(
        service.validateCredentials(identifier, credentials),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request exception if the credentials are not set', async () => {
      const credentials = 'Password123!';

      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';
      userAuth.type = AuthType.LOCAL;
      userAuth.user = new User();

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: userAuth.identifier, type: userAuth.type },
          relations: { user: true },
        })
        .mockResolvedValue(userAuth);

      await expect(
        service.validateCredentials(userAuth.identifier, credentials),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request exception if the credentials are invalid', async () => {
      const credentials = 'Password123!';

      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';
      userAuth.credentials = await bcrypt.hash(credentials, 10);
      userAuth.type = AuthType.LOCAL;
      userAuth.user = new User();

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: userAuth.identifier, type: userAuth.type },
          relations: ['user'],
        })
        .mockResolvedValue(userAuth);

      await expect(
        service.validateCredentials(userAuth.identifier, 'invalid-password'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
