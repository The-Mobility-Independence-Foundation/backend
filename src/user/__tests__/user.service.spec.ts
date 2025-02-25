import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserAuthService } from '../user-auth.service';
import { UserAuth } from '../entities/user-auth.entity';
import { AuthType } from '../entities/user-auth.entity';
import { when } from 'jest-when';
import { RegisterDto } from '../../auth/dto/register.dto';
import { ProviderProfile } from '../../auth/entities/provider-profile.entity';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let authService: UserAuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(UserService);
    authService = module.get(UserAuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('findByEmail', () => {
    it('should find a user auth by email', async () => {
      const user = new User();
      user.email = 'test@test.com';
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.displayName = 'John Doe';

      when(userRepository.findOne)
        .calledWith({ where: { email: user.email } })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should find a user auth by email with additional where conditions', async () => {
      const user = new User();
      user.email = 'test@test.com';
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.displayName = 'John Doe';

      when(userRepository.findOne)
        .calledWith({
          where: { email: user.email, firstName: user.firstName },
        })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email, {
        where: { firstName: user.firstName },
      });

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should find a user auth by email with additional relations', async () => {
      const user = new User();
      user.email = 'test@test.com';
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.displayName = 'John Doe';

      const userAuth = new UserAuth();

      user.auth = userAuth;
      userAuth.user = user;

      when(userRepository.findOne)
        .calledWith({ where: { email: user.email }, relations: { auth: true } })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email, {
        relations: { auth: true },
      });

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(result?.auth).toBe(userAuth);
    });

    it('should find a user auth by email regardless of the case of the email', async () => {
      const user = new User();
      user.email = 'test@test.com';
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.displayName = 'John Doe';

      when(userRepository.findOne)
        .calledWith({ where: { email: user.email } })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email.toUpperCase());

      expect(result).toBe(user);
    });

    it('should return null if the user auth is not found', async () => {
      when(userRepository.findOne).mockResolvedValue(null);

      const result = await service.findByEmail('test@test.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a user record with a register dto', async () => {
      const registerDto = new RegisterDto();
      registerDto.email = 'test@test.com';
      registerDto.password = 'password';
      registerDto.firstName = 'John';
      registerDto.lastName = 'Doe';
      registerDto.displayName = 'John Doe';

      const userAuth = new UserAuth();
      userAuth.type = AuthType.LOCAL;
      userAuth.identifier = registerDto.email;
      userAuth.credentials = registerDto.password;

      when(userRepository.findOne).mockResolvedValue(null);
      when(authService.findByIdentifier).mockResolvedValue(null);
      when(authService.initializeLocalAuth).mockResolvedValue(userAuth);
      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.create(registerDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerDto.email);
      expect(result.firstName).toBe(registerDto.firstName);
      expect(result.lastName).toBe(registerDto.lastName);
      expect(result.displayName).toBe(registerDto.displayName);

      expect(result.auth).toStrictEqual(userAuth);
    });

    it('should create a user record with a provider profile', async () => {
      const providerProfile = new ProviderProfile();
      providerProfile.id = '1234567890';
      providerProfile.provider = AuthType.GOOGLE;
      providerProfile.accessToken = 'accessToken';
      providerProfile.refreshToken = 'refreshToken';
      providerProfile.displayName = 'John Doe';
      providerProfile.firstName = 'John';
      providerProfile.lastName = 'Doe';
      providerProfile.email = 'test@test.com';
      providerProfile.image = 'image';

      const userAuth = new UserAuth();
      userAuth.type = providerProfile.provider;
      userAuth.identifier = providerProfile.email;
      userAuth.providerAccountId = providerProfile.id;
      userAuth.accessToken = providerProfile.accessToken;
      userAuth.refreshToken = providerProfile.refreshToken;

      when(userRepository.findOne).mockResolvedValue(null);
      when(authService.findByIdentifier).mockResolvedValue(null);
      when(authService.initializeProviderAuth).mockResolvedValue(userAuth);
      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.create(providerProfile);

      expect(result).toBeDefined();
      expect(result.email).toBe(providerProfile.email);
      expect(result.firstName).toBe(providerProfile.firstName);
      expect(result.lastName).toBe(providerProfile.lastName);
      expect(result.displayName).toBe(providerProfile.displayName);

      expect(result.auth).toStrictEqual(userAuth);
    });

    it('should throw a bad request exception if the user already exists', async () => {
      const registerDto = new RegisterDto();
      registerDto.email = 'test@test.com';
      registerDto.password = 'password';
      registerDto.firstName = 'John';
      registerDto.lastName = 'Doe';
      registerDto.displayName = 'John Doe';

      when(userRepository.findOne).mockResolvedValue(new User());
      when(authService.findByIdentifier).mockResolvedValue(new UserAuth());

      await expect(service.create(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
