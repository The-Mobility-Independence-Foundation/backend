import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { when } from 'jest-when';
import { UserAuthService } from '../../user/user-auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserAuth } from '../../user/entities/user-auth.entity';
import { RegisterDto } from '../dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let authService: jest.Mocked<UserAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'GOOGLE_CLIENT_ID':
                  return 'dummy-google-client-id';
                case 'GOOGLE_CLIENT_SECRET':
                  return 'dummy-google-client-secret';
                case 'GOOGLE_CALLBACK_URL':
                  return 'http://localhost:3000/auth/google/callback';
                case 'JWT_SECRET':
                  return 'dummy-jwt-secret';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(AuthService);
    authService = module.get(UserAuthService);
  });

  describe('register', () => {
    it('should throw an error if the user already exists', async () => {
      const userRegisterDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        email: 'test@test.com',
        password: 'password',
      };

      const existingAuth = new UserAuth();

      when(authService.findByIdentifier)
        .calledWith(userRegisterDto.email)
        .mockResolvedValue(existingAuth);

      await expect(service.register(userRegisterDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.findByIdentifier).toHaveBeenCalledWith(
        userRegisterDto.email,
      );
    });

    // it('should create a new user', async () => {
    //   const userRegisterDto: UserRegisterDto = {
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     displayName: 'John Doe',
    //     email: 'test@test.com',
    //     password: 'password',
    //   };

    //   when(authService.findByEmail)
    //     .calledWith(userRegisterDto.email)
    //     .mockResolvedValue(null);

    //   const mockUser = new User();
    //   mockUser.firstName = userRegisterDto.firstName;
    //   mockUser.lastName = userRegisterDto.lastName;
    //   mockUser.email = userRegisterDto.email;
    //   mockUser.displayName = userRegisterDto.displayName;

    //   when(userService.create)
    //     .calledWith({
    //       firstName: userRegisterDto.firstName,
    //       lastName: userRegisterDto.lastName,
    //       email: userRegisterDto.email,
    //       displayName: userRegisterDto.displayName,
    //     })
    //     .mockResolvedValue(mockUser);

    //   const mockUserAuth = new UserAuth();
    //   mockUserAuth.user = mockUser;

    //   when(authService.createEmailAuth)
    //     .calledWith(mockUser, userRegisterDto.email, userRegisterDto.password)
    //     .mockResolvedValue(mockUserAuth);

    //   const result = await service.register(userRegisterDto);

    //   expect(authService.findByEmail).toHaveBeenCalledWith(
    //     userRegisterDto.email,
    //   );
    //   expect(userService.create).toHaveBeenCalledWith({
    //     firstName: userRegisterDto.firstName,
    //     lastName: userRegisterDto.lastName,
    //     email: userRegisterDto.email,
    //     displayName: userRegisterDto.displayName,
    //   });
    //   expect(authService.createEmailAuth).toHaveBeenCalledWith(
    //     mockUser,
    //     userRegisterDto.email,
    //     userRegisterDto.password,
    //   );
    //   expect(result).toEqual(mockUser);
    // });
  });
});
