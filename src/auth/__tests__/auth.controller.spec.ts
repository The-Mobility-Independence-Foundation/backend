import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { UserRegisterDto } from '../dto/register.dto';
import { when } from 'jest-when';
import { User } from '../../user/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
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

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const userRegisterDto: UserRegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        email: 'test@test.com',
        password: 'password',
      };

      const mockUser = new User();
      mockUser.id = 1;
      mockUser.organization = null;
      mockUser.firstName = 'John';
      mockUser.lastName = 'Doe';
      mockUser.email = 'test@test.com';

      when(service.register)
        .calledWith(userRegisterDto)
        .mockResolvedValue(mockUser);

      const result = await controller.register(userRegisterDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
      expect(result.firstName).toBe(mockUser.firstName);
      expect(result.lastName).toBe(mockUser.lastName);
      expect(result.email).toBe(mockUser.email);
    });
  });
});
