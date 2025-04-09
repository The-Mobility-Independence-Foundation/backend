import { Test, TestingModule } from '@nestjs/testing';
import { UserResourceAccessStrategy } from '../strategies/user-resource-access.strategy';
import { User } from '../../../user/entities/user.entity';

describe('UserResourceAccessStrategy', () => {
  let strategy: UserResourceAccessStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResourceAccessStrategy],
    }).compile();

    strategy = module.get(UserResourceAccessStrategy);
  });

  describe('canAccess', () => {
    it('should return true when user id matches resource user id', async () => {
      const user = new User();
      user.id = 1;

      const params = { userId: '1' };

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(true);
    });

    it('should return false when user id does not match resource user id', async () => {
      const user = new User();
      user.id = 1;

      const params = { userId: '2' };

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
    });

    it('should return false when userId param is not a number', async () => {
      const user = new User();
      user.id = 1;

      const params = { userId: 'not-a-number' };

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
    });

    it('should return false when userId param is missing', async () => {
      const user = new User();
      user.id = 1;

      const params = {};

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
    });
  });
});
