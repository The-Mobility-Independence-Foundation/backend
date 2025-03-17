import { Test, TestingModule } from '@nestjs/testing';
import { ResourceAccessGuard } from '../guards/resource-access.guard';
import { Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User, UserRole } from '../../user/entities/user.entity';
import { RESOURCE_ACCESS } from '../decorators/resource-access.decorator';

describe('ResourceAccessGuard', () => {
  let guard: ResourceAccessGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceAccessGuard,
        {
          provide: Reflector,
          useValue: createMock<Reflector>(),
        },
      ],
    }).compile();

    guard = module.get(ResourceAccessGuard);
    reflector = module.get(Reflector);
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;
    let mockRequest: any;
    let mockUser: User;

    beforeEach(() => {
      mockUser = new User();
      mockRequest = {
        user: mockUser,
        params: {},
      };

      mockContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      });
    });

    it('should throw ForbiddenException if user is not authenticated', () => {
      mockRequest.user = undefined;

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User not authenticated',
      );
    });

    it('should allow access if user is admin', () => {
      Object.assign(mockUser, { type: UserRole.ADMIN });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({});

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if adminOnly is true and user is not admin', () => {
      Object.assign(mockUser, { type: UserRole.USER });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({ adminOnly: true });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'You do not have permission to access this resource',
      );
    });

    it('should throw ForbiddenException with custom message if provided', () => {
      Object.assign(mockUser, { type: UserRole.USER });
      const customMessage = 'Custom forbidden message';

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({
          adminOnly: true,
          forbiddenMessage: customMessage,
        });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(customMessage);
    });

    it('should allow access if moderatorAccess is true and user is moderator', () => {
      Object.assign(mockUser, { type: UserRole.MODERATOR });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({ moderatorAccess: true });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access if user is accessing their own resource', () => {
      Object.assign(mockUser, { id: 123, type: UserRole.USER });
      mockRequest.params = { userId: '123' };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({});

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should use custom userIdParam if provided', () => {
      Object.assign(mockUser, { id: 123, type: UserRole.USER });
      mockRequest.params = { customId: '123' };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({ userIdParam: 'customId' });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if user is accessing another user resource', () => {
      Object.assign(mockUser, { id: 123, type: UserRole.USER });
      mockRequest.params = { userId: '456' };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({});

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if userId param is not a number', () => {
      Object.assign(mockUser, { id: 123, type: UserRole.USER });
      mockRequest.params = { userId: 'not-a-number' };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue({});

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should use empty options if no metadata is found', () => {
      Object.assign(mockUser, { id: 123, type: UserRole.USER });
      mockRequest.params = { userId: '123' };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [
          mockContext.getHandler(),
          mockContext.getClass(),
        ])
        .mockReturnValue(null);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });
});
