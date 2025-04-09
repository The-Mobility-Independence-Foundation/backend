import { Test, TestingModule } from '@nestjs/testing';
import { AnyUserResourceAccessStrategy } from '../strategies/any-user-resource-access.strategy';
import { User } from '../../../user/entities/user.entity';
import { UserRole } from '../../../user/entities/user.entity';

describe('AnyUserResourceAccessStrategy', () => {
  let strategy: AnyUserResourceAccessStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnyUserResourceAccessStrategy],
    }).compile();

    strategy = module.get(AnyUserResourceAccessStrategy);
  });

  describe('canAccess', () => {
    it('should return true when user is authenticated', async () => {
      const user = new User();
      Object.assign(user, { type: UserRole.USER });

      const result = await strategy.canAccess();

      expect(result).toBe(true);
    });

    it('should return true when user is a guest', async () => {
      const user = new User();
      Object.assign(user, { type: UserRole.GUEST });

      const result = await strategy.canAccess();

      expect(result).toBe(true);
    });
  });

  describe('getForbiddenMessage', () => {
    it('should return the default forbidden message', () => {
      const message = strategy.getForbiddenMessage();
      expect(message).toBe('You must be authenticated to access this resource');
    });
  });
});
