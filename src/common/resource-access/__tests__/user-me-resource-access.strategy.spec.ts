import { Test, TestingModule } from '@nestjs/testing';
import { UserMeResourceAccessStrategy } from '../strategies/user-me-resource-access.strategy';

describe('UserMeResourceAccessStrategy', () => {
  let strategy: UserMeResourceAccessStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMeResourceAccessStrategy],
    }).compile();

    strategy = module.get<UserMeResourceAccessStrategy>(
      UserMeResourceAccessStrategy,
    );
  });

  describe('canAccess', () => {
    it('should always return true', async () => {
      const result = await strategy.canAccess();

      expect(result).toBe(true);
    });
  });

  describe('getForbiddenMessage', () => {
    it('should return the default forbidden message', () => {
      const message = strategy.getForbiddenMessage();
      expect(message).toBe(
        'You do not have permission to access this resource',
      );
    });
  });
});
