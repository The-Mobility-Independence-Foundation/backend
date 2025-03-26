import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { PublicUserResourceAccessStrategy } from '../strategies/public-user-resource-access.strategy';
import { User } from '../../../user/entities/user.entity';
import { UserRole } from '../../../user/entities/user.entity';

describe('PublicUserResourceAccessStrategy', () => {
  let strategy: PublicUserResourceAccessStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicUserResourceAccessStrategy],
    }).compile();

    strategy = module.get(PublicUserResourceAccessStrategy);
  });

  describe('canAccess', () => {
    it('should return true when user is not a guest', async () => {
      const user = new User();
      Object.assign(user, { type: UserRole.USER });

      const result = await strategy.canAccess(user);

      expect(result).toBe(true);
    });

    it('should return false when user is a guest', async () => {
      const user = new User();
      Object.assign(user, { type: UserRole.GUEST });

      const result = await strategy.canAccess(user);

      expect(result).toBe(false);
    });
  });

  describe('getForbiddenMessage', () => {
    it('should return the default forbidden message', () => {
      const message = strategy.getForbiddenMessage();
      expect(message).toBe(
        'You must be a non-guest user to access this resource',
      );
    });
  });
});
