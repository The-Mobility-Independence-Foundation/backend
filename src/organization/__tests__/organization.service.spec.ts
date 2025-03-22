import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../organization.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../organization.entity';
import { createMock } from '@golevelup/ts-jest';
// import { AddressService } from '../../address/address.service';
// import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';

describe('OrganizationService', () => {
  let service: OrganizationService;
  // let userService: UserService;
  // let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(Organization),
          useValue: createMock<Repository<Organization>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(OrganizationService);
    // userService = module.get(UserService);
    // addressService = module.get(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
