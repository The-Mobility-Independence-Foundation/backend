import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationMemberResourceAccessStrategy } from '../strategies/organization-member-resource-access.strategy';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../../../user/user.service';
import { User } from '../../../user/entities/user.entity';
import { Organization } from '../../../organization/organization.entity';
import { when } from 'jest-when';

describe('OrganizationMemberResourceAccessStrategy', () => {
  let strategy: OrganizationMemberResourceAccessStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationMemberResourceAccessStrategy],
    })
      .useMocker(createMock)
      .compile();
    strategy = module.get(OrganizationMemberResourceAccessStrategy);
    userService = module.get(UserService);
  });

  describe('canAccess', () => {
    let user: User;
    
    beforeEach(async () => {
      user = new User();
    });

    it('should return false when orgId is not a number', async () => {
      Object.assign(user, {
        id: 1,
      });
      const params = { orgId: 'NaN' };

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
      expect(userService.findByIdOrThrow).not.toHaveBeenCalled();
    });

    it('should return true when user is in org', async () => {
      const org = new Organization();
      Object.assign(org, {
        id: 1,
      });
      Object.assign(user, {
        id: 1,
        organization: org,
      });
      const params = { orgId: String(org.id) };

      when(userService.findByIdOrThrow).calledWith(user.id, expect.anything()).mockResolvedValue(user);

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(true);
      expect(userService.findByIdOrThrow).toHaveBeenCalledWith(user.id, expect.anything());
    });

    it('should return true when user is in org', async () => {
      const org = new Organization();
      Object.assign(org, {
        id: 1,
      });
      Object.assign(user, {
        id: 1,
        organization: new Organization(),
      });
      const params = { orgId: String(org.id) };

      when(userService.findByIdOrThrow).calledWith(user.id, expect.anything()).mockResolvedValue(user);

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
      expect(userService.findByIdOrThrow).toHaveBeenCalledWith(user.id, expect.anything());
    });
  });
});
