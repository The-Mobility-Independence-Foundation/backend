//import { Test, TestingModule } from '@nestjs/testing';
//import { OrganizationMemberResourceAccessStrategy } from '../strategies/organization-member-resource-access.strategy';
//import { createMock } from '@golevelup/ts-jest';
//import { UserService } from '../../../user/user.service';

describe('OrganizationMemberResourceAccessStrategy', () => {
  //let strategy: OrganizationMemberResourceAccessStrategy;
  //let userService: UserService;

  beforeEach(async () => {
    /*
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationMemberResourceAccessStrategy],
    })
      .useMocker(createMock)
      .compile();
      */
    //strategy = module.get(OrganizationMemberResourceAccessStrategy);
    //userService = module.get(UserService);
  });

  describe('canAccess', () => {
    it('should return true when user id matches resource user id', async () => {});
  });
});
