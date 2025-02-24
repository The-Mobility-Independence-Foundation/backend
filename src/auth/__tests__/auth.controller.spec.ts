import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { createMock } from '@golevelup/ts-jest';
import { UserRegisterDto } from '../dto/register.dto';
import { when } from 'jest-when';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { AuthType } from '../../user/entities/user-auth.entity';
import { ProviderProfile } from '../entities/provider-profile.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

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
      const userRegisterDto: UserRegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        email: 'test@test.com',
        password: 'password',
      };

      const mockUser = new User();
      mockUser.firstName = userRegisterDto.firstName;
      mockUser.lastName = userRegisterDto.lastName;
      mockUser.email = userRegisterDto.email;

      when(service.register)
        .calledWith(userRegisterDto)
        .mockResolvedValue(mockUser);

      const result = await controller.register(userRegisterDto);

      expect(service.register).toHaveBeenCalledWith(userRegisterDto);
      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };

      when(service.generateToken)
        .calledWith(loginDto.email)
        .mockReturnValue('mock-token');

      const result = await controller.login(loginDto);

      expect(service.generateToken).toHaveBeenCalledWith(loginDto.email);
      expect(result).toBeDefined();
      expect(result.accessToken).toBe('mock-token');
    });
  });

  describe('googleLogin', () => {
    it('should exist but return void', () => {
      expect(controller.googleLogin()).toBeUndefined();
    });
  });

  describe('googleCallback', () => {
    it('should successfully handle Google OAuth callback', async () => {
      const providerProfile: ProviderProfile = {
        id: '123',
        provider: AuthType.GOOGLE,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        image: 'https://example.com/image.jpg',
      };

      const mockUser = new User();
      mockUser.firstName = providerProfile.firstName;
      mockUser.lastName = providerProfile.lastName;
      mockUser.email = providerProfile.email;

      when(service.handleProviderLogin)
        .calledWith(providerProfile)
        .mockResolvedValue(mockUser);

      when(service.generateToken)
        .calledWith(providerProfile.email)
        .mockReturnValue('mock-token');

      const result = await controller.googleCallback({
        user: providerProfile,
      } as any);

      expect(service.handleProviderLogin).toHaveBeenCalledWith(providerProfile);
      expect(result).toBeDefined();
      expect(result.accessToken).toBe('mock-token');
    });
  });
});
