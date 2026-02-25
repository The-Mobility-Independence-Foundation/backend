import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from '../strategies/local.strategy';
import { AuthService } from '../auth.service';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy],
    })
      .useMocker(createMock)
      .compile();

    strategy = module.get(LocalStrategy);
    authService = module.get(AuthService);
  });

  describe('validate', () => {
    it('should validate credentials successfully', async () => {
      const email = 'test@test.com';
      const credentials = 'Password123!';

      const user = new User();
      Object.assign(user, {
        email,
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      when(authService.validateCredentials)
        .calledWith(email, credentials)
        .mockResolvedValue(user);

      const result = await strategy.validate(email, credentials);

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(authService.validateCredentials).toHaveBeenCalledWith(
        email,
        credentials,
      );
    });

    it('should throw BadRequestException if credentials are invalid', async () => {
      const email = 'test@test.com';
      const credentials = 'InvalidPassword123!';

      when(authService.validateCredentials)
        .calledWith(email, credentials)
        .mockRejectedValue(new BadRequestException('Invalid credentials'));

      await expect(strategy.validate(email, credentials)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.validateCredentials).toHaveBeenCalledWith(
        email,
        credentials,
      );
    });
  });
});
