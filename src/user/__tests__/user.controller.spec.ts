import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../../organization/organization.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Request } from 'express';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: createMock<Repository<Organization>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return the user from the request', async () => {
      const user = new User();
      Object.assign(user, {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const req = {
        user,
      } as Partial<Request> as Request;

      const result = await controller.getUser(req);

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });
  });
});
