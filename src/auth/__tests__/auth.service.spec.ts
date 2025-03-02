import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserAuthService } from '../../user/user-auth.service';
import { UserService } from '../../user/user.service';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { User } from '../../user/entities/user.entity';
import { UserAuth, AuthType } from '../../user/entities/user-auth.entity';
import { RegisterDto } from '../dto/register.dto';
import { AuthProviderProfile } from '../entities/auth-provider-profile.entity';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userAuthService: UserAuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(AuthService);
    jwtService = module.get(JwtService);
    userAuthService = module.get(UserAuthService);
    userService = module.get(UserService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        email: 'test@test.com',
        password: 'Password123!',
      };

      const user = new User();
      Object.assign(user, {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        displayName: registerDto.displayName,
        email: registerDto.email,
      });

      when(userService.create).calledWith(registerDto).mockResolvedValue(user);

      const result = await service.register(registerDto);

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(userService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('handleProviderLogin', () => {
    it('should return existing user if auth exists with same provider', async () => {
      const authProviderProfile = new AuthProviderProfile();
      Object.assign(authProviderProfile, {
        id: '123',
        email: 'test@test.com',
        provider: AuthType.GOOGLE,
        accessToken: 'access.token.here',
        refreshToken: 'refresh.token.here',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/image.png',
      });

      const user = new User();
      const userAuth = new UserAuth();
      Object.assign(userAuth, {
        type: AuthType.GOOGLE,
        user: user,
      });

      when(userAuthService.findByIdentifier)
        .calledWith(authProviderProfile.email)
        .mockResolvedValue(userAuth);

      const result = await service.handleProviderLogin(authProviderProfile);

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException if user exists with different provider', async () => {
      const authProviderProfile = new AuthProviderProfile();
      Object.assign(authProviderProfile, {
        id: '123',
        email: 'test@test.com',
        provider: AuthType.GOOGLE,
        accessToken: 'access.token.here',
        refreshToken: 'refresh.token.here',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/image.png',
      });

      const userAuth = new UserAuth();
      Object.assign(userAuth, {
        type: AuthType.LOCAL,
      });

      when(userAuthService.findByIdentifier)
        .calledWith(authProviderProfile.email)
        .mockResolvedValue(userAuth);

      await expect(
        service.handleProviderLogin(authProviderProfile),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create new user if auth does not exist', async () => {
      const authProviderProfile = new AuthProviderProfile();
      Object.assign(authProviderProfile, {
        id: '123',
        email: 'test@test.com',
        provider: AuthType.GOOGLE,
        accessToken: 'access.token.here',
        refreshToken: 'refresh.token.here',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/image.png',
      });

      const user = new User();
      Object.assign(user, {
        firstName: authProviderProfile.firstName,
        lastName: authProviderProfile.lastName,
        displayName: authProviderProfile.displayName,
        email: authProviderProfile.email,
      });

      when(userAuthService.findByIdentifier)
        .calledWith(authProviderProfile.email)
        .mockResolvedValue(null);

      when(userService.create)
        .calledWith(authProviderProfile)
        .mockResolvedValue(user);

      const result = await service.handleProviderLogin(authProviderProfile);

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(userService.create).toHaveBeenCalledWith(authProviderProfile);
    });
  });

  describe('validateCredentials', () => {
    it('should validate credentials successfully', async () => {
      const identifier = 'test@test.com';
      const credentials = 'Password123!';
      const hashedPassword = await bcrypt.hash(credentials, 10);

      const user = new User();
      const userAuth = new UserAuth();
      Object.assign(userAuth, {
        type: AuthType.LOCAL,
        credentials: hashedPassword,
        user: user,
      });

      when(userAuthService.findByIdentifier)
        .calledWith(identifier, { where: { type: AuthType.LOCAL } })
        .mockResolvedValue(userAuth);

      const result = await service.validateCredentials(identifier, credentials);

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should throw BadRequestException if user auth not found', async () => {
      const identifier = 'test@test.com';
      const credentials = 'Password123!';

      when(userAuthService.findByIdentifier)
        .calledWith(identifier, { where: { type: AuthType.LOCAL } })
        .mockResolvedValue(null);

      await expect(
        service.validateCredentials(identifier, credentials),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if credentials not set', async () => {
      const identifier = 'test@test.com';
      const credentials = 'Password123!';

      const userAuth = new UserAuth();
      Object.assign(userAuth, {
        type: AuthType.LOCAL,
        credentials: null,
      });

      when(userAuthService.findByIdentifier)
        .calledWith(identifier, { where: { type: AuthType.LOCAL } })
        .mockResolvedValue(userAuth);

      await expect(
        service.validateCredentials(identifier, credentials),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if credentials are invalid', async () => {
      const identifier = 'test@test.com';
      const credentials = 'Password123!';
      const hashedPassword = await bcrypt.hash('different-password', 10);

      const userAuth = new UserAuth();
      Object.assign(userAuth, {
        type: AuthType.LOCAL,
        credentials: hashedPassword,
      });

      when(userAuthService.findByIdentifier)
        .calledWith(identifier, { where: { type: AuthType.LOCAL } })
        .mockResolvedValue(userAuth);

      await expect(
        service.validateCredentials(identifier, credentials),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const email = 'test@test.com';
      const token = 'jwt.token.here';

      when(jwtService.sign).calledWith({ email }).mockReturnValue(token);

      const result = service.generateToken(email);

      expect(result).toBe(token);
      expect(jwtService.sign).toHaveBeenCalledWith({ email });
    });
  });
});
