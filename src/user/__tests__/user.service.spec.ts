import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { when } from 'jest-when';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should throw an error if the user already exists', async () => {
      const user = new User();
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.email = 'john.doe@example.com';
      user.displayName = 'John Doe';

      when(userRepository.findOne)
        .calledWith({
          where: { email: user.email.toLowerCase() },
        })
        .mockResolvedValue(user);

      await expect(
        service.create({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          displayName: user.displayName,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should find an existing user by email, regardless of case', async () => {
      const user = new User();
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.email = 'john.doe@example.com';
      user.displayName = 'John Doe';

      when(userRepository.findOne)
        .calledWith({
          where: { email: user.email.toLowerCase() },
        })
        .mockResolvedValue(user);

      await expect(
        service.create({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email.toUpperCase(),
          displayName: user.displayName,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    // it('should create a new user', async () => {
    //   const user = new User();
    //   user.firstName = 'John';
    //   user.lastName = 'Doe';
    //   user.email = 'john.doe@example.com';
    //   user.displayName = 'John Doe';
    //   user.signupComplete = true;

    //   when(userRepository.save).calledWith(user).mockResolvedValue(user);

    //   const result = await service.create({
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.email,
    //     displayName: user.displayName,
    //   });

    //   expect(userRepository.save).toHaveBeenCalledWith(user);
    //   expect(result).toBe(user);
    // });

    it('should throw an error if entity validation fails', async () => {
      const user = new User();
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.email = 'john.doe@example.com';
      user.displayName = 'John Doe';

      when(userRepository.save).calledWith(user).mockRejectedValue(new Error());

      await expect(
        service.create({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          displayName: user.displayName,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
