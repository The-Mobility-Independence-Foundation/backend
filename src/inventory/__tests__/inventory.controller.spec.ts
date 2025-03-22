import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from '../inventory.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '../inventory.entity';
import { Organization } from '../../organization/organization.entity';
import { InventoryService } from '../inventory.service';
import { Address } from '../../address/address.entity';
//import { PaginationService } from '../../common/services/pagination.service';
//import { OrganizationService } from '../../organization/organization.service';
//import { AddressService } from '../../address/address.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('InventoryController', () => {
  let controller: InventoryController;
  //let paginationService: PaginationService;
  //let organizationService: OrganizationService;
  //let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: createMock<Repository<Inventory>>(),
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: createMock<Repository<Organization>>(),
        },
        {
          provide: getRepositoryToken(Address),
          useValue: createMock<Repository<Address>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<InventoryController>(InventoryController);
    //paginationService = module.get(PaginationService);
    //organizationService = module.get(OrganizationService);
    //addressService = module.get(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
