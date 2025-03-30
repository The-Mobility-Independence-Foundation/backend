import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../order.entity';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
/*
import { AddressService } from '../../address/address.service';
import { UserService } from '../../user/user.service';
import { ListingService } from '../../listing/listing.service';
import { OrganizationService } from '../../organization/organization.service';
*/

describe('OrderService', () => {
  let service: OrderService;
  /*
  let userService: UserService;
  let addressService: AddressService;
  let listingService: ListingService;
  let organizationService: OrganizationService;
  let repository: Repository<Order>;
  let userRepository: Repository<User>;
  */

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: createMock<Repository<Order>>(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(OrderService);
    /*
    userService = module.get(UserService);
    addressService = module.get(AddressService);
    listingService = module.get(ListingService);
    organizationService = module.get(OrganizationService);
    repository = module.get(getRepositoryToken(Order));
    userRepository = module.get(getRepositoryToken(User));
    */
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
