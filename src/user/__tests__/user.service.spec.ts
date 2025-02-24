import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';

describe('UserService', () => {
  let service: UserService;

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
    // authService = module.get(UserAuthService);
    // userRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should exist', () => {
      expect(service).toBeDefined();
    });
    // it('should create a user with local auth', async () => {
    //   const registerDto: RegisterDto = {
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     displayName: 'John Doe',
    //     email: 'john.doe@example.com',
    //     password: 'password',
    //   };
    //   when(userRepository.findOne)
    //     .calledWith({ where: { email: registerDto.email } })
    //     .mockResolvedValue(null);
    //   when(authService.findByEmail)
    //     .calledWith(registerDto.email)
    //     .mockResolvedValue(null);
    //   const user = await service.create(registerDto);
    //   expect(user).toBeDefined();
    // });
  });
});
