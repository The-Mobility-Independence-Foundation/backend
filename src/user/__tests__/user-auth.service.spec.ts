import { Repository } from 'typeorm';
import { UserAuthService } from '../user-auth.service';
import { UserAuth, AuthType } from '../entities/user-auth.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { ValidationException } from '../../common/exceptions/validation.exception';
import { ProviderProfile } from 'src/auth/entities/provider-profile.entity';
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

  describe('findByEmail', () => {
    it('should find a user auth by email', async () => {
      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: userAuth.identifier },
          relations: ['user'],
        })
        .mockResolvedValue(userAuth);

      const result = await service.findByEmail(userAuth.identifier);

      expect(result).toBeDefined();
      expect(result).toBe(userAuth);
    });

    it('should find a user auth by email with additional where conditions', async () => {
      const userAuth = new UserAuth();
      userAuth.identifier = 'test@test.com';
      userAuth.type = AuthType.LOCAL;

      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: 'test@test.com', type: AuthType.LOCAL },
          relations: ['user'],
        })
        .mockResolvedValue(userAuth);

      const result = await service.findByEmail('test@test.com', {
        type: AuthType.LOCAL,
      });

      expect(result).toBeDefined();
      expect(result).toBe(userAuth);
    });

    it('should return null if the user auth is not found', async () => {
      when(userAuthRepository.findOne)
        .calledWith({
          where: { identifier: 'test@test.com' },
          relations: ['user'],
        })
        .mockResolvedValue(null);

      const result = await service.findByEmail('test@test.com');

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
    });

    it('should throw a validation exception if the email is invalid', async () => {
      await expect(
        service.initializeLocalAuth('invalid-email', 'password'),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('initializeProviderAuth', () => {
    it('should initialize a provider auth record', async () => {
      const providerProfile: ProviderProfile = {
        id: '123',
        email: 'test@test.com',
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
      expect(userAuth.accessToken).toBe('accessToken');
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

  //   describe('validateCredentials', () => {
  //     it('should validate the credentials of a local auth record', async () => {
  //       const userAuth = await service.initializeLocalAuth('test@test.com', 'Password123!');

  //       const result = await service.validateCredentials('test@test.com', 'Password123!');

  //       expect(result).toBeDefined();
  //       expect(result).toBe(userAuth);
  //     });
  //   });
});
