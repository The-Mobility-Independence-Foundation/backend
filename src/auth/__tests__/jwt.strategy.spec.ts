import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserService } from '../../user/user.service';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    })
      .useMocker(createMock)
      .compile();

    strategy = module.get(JwtStrategy);
    userService = module.get(UserService);
  });

  describe('validate', () => {
    it('should validate JWT payload successfully', async () => {
      const email = 'test@test.com';
      const user = new User();
      Object.assign(user, {
        email,
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      when(userService.findByEmail).calledWith(email).mockResolvedValue(user);

      const result = await strategy.validate({ email });

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const email = 'nonexistent@test.com';

      when(userService.findByEmail).calledWith(email).mockResolvedValue(null);

      await expect(strategy.validate({ email })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });
  });
});
