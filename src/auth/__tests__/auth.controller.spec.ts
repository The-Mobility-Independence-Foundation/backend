import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { createMock } from '@golevelup/ts-jest';
import { RegisterDto } from '../dto/register.dto';
import { when } from 'jest-when';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { AuthType } from '../../user/entities/user-auth.entity';
import { AuthProviderProfile } from '../entities/auth-provider-profile.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
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
        email: registerDto.email,
        displayName: registerDto.displayName,
      });

      when(service.register).calledWith(registerDto).mockResolvedValue(user);

      const result = await controller.register(registerDto);

      expect(result).toBeUndefined();
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'Password123!',
      };

      const token = 'jwt.token.here';

      when(service.generateToken)
        .calledWith(loginDto.email)
        .mockReturnValue(token);

      const result = await controller.login(loginDto);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe(token);
      expect(service.generateToken).toHaveBeenCalledWith(loginDto.email);
    });
  });

  describe('googleLogin', () => {
    it('should exist but return void (handled by GoogleOAuthGuard)', () => {
      expect(controller.googleLogin()).toBeUndefined();
    });
  });

  describe('googleCallback', () => {
    it('should successfully handle Google OAuth callback', async () => {
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

      const token = 'jwt.token.here';

      when(service.handleProviderLogin)
        .calledWith(authProviderProfile)
        .mockResolvedValue(user);

      when(service.generateToken).calledWith(user.email).mockReturnValue(token);

      const result = await controller.googleCallback({
        user: authProviderProfile,
      } as any);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe(token);
      expect(service.handleProviderLogin).toHaveBeenCalledWith(
        authProviderProfile,
      );
      expect(service.generateToken).toHaveBeenCalledWith(user.email);
    });
  });
});
