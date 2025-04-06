import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationOwnerResourceAccessStrategy } from '../strategies/organization-owner-resource-access.strategy';
import { createMock } from '@golevelup/ts-jest';
import { OrganizationService } from '../../../organization/organization.service';
import { User } from '../../../user/entities/user.entity';
import { Organization } from '../../../organization/organization.entity';
import { when } from 'jest-when';

describe('OrganizationOwnerResourceAccessStrategy', () => {
  let strategy: OrganizationOwnerResourceAccessStrategy;
  let organizationService: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationOwnerResourceAccessStrategy],
    })
      .useMocker(createMock)
      .compile();

    strategy = module.get(OrganizationOwnerResourceAccessStrategy);
    organizationService = module.get(OrganizationService);
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
      expect(organizationService.findByIdOrThrow).not.toHaveBeenCalled();
    });

    it('should return true when user owns the org', async () => {
      Object.assign(user, {
        id: 1,
      });
      const org = new Organization();
      Object.assign(org, {
        id: 1,
        owner: user,
      });
      const params = { orgId: String(org.id) };

      when(organizationService.findByIdOrThrow)
        .calledWith(org.id, expect.anything())
        .mockResolvedValue(org);

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(true);
    });

    it('should return false when user doesnt own the org', async () => {
      Object.assign(user, {
        id: 1,
      });
      const org = new Organization();
      Object.assign(org, {
        id: 1,
        owner: new User(),
      });
      const params = { orgId: String(org.id) };

      when(organizationService.findByIdOrThrow)
        .calledWith(org.id, expect.anything())
        .mockResolvedValue(org);

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
    });
  });
});
