import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { GuestResourceAccessStrategy } from '../strategies/guest-resource-access.strategy';
import { User, UserRole } from '../../../user/entities/user.entity';

describe('GuestResourceAccessStrategy', () => {
  let strategy: GuestResourceAccessStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestResourceAccessStrategy],
    }).compile();

    strategy = module.get(GuestResourceAccessStrategy);
  });

  describe('canAccess', () => {
    it('should return true when user is a guest', async () => {
      const user = new User();
      Object.assign(user, { type: UserRole.GUEST });

      const result = await strategy.canAccess(user);

      expect(result).toBe(true);
    });

    it('should return false when user is not a guest', async () => {
      const user = new User();
      Object.assign(user, { type: UserRole.USER });

      const result = await strategy.canAccess(user);

      expect(result).toBe(false);
    });
  });

  describe('getForbiddenMessage', () => {
    it('should return the default forbidden message', () => {
      const message = strategy.getForbiddenMessage();
      expect(message).toBe('You must be a guest to access this resource');
    });
  });
});
