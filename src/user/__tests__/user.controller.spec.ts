import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import {
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from '../../common/resource-access/interfaces/strategy-provider.interface';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(UserController);
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
