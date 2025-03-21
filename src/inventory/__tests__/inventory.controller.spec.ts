import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from '../inventory.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '../inventory.entity';
import { Organization } from '../../organization/organization.entity';
import { InventoryService } from '../inventory.service';
import { Address } from '../../address/address.entity';
import { PaginationService } from '../../common/services/pagination.service';
import { OrganizationService } from '../../organization/organization.service';
import { AddressService } from '../../address/address.service';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

export const mockPaginationService = {
  paginateWithCursor: jest.fn(),
};

export const mockOrganizationService = {
  findById: jest.fn(),
};

export const mockAddressService = {
  findById: jest.fn(),
};

describe('InventoryController', () => {
  let controller: InventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Address),
          useClass: mockRepository,
        },
        {
          provide: PaginationService, 
          useValue: mockPaginationService,
        },
        {
          provide: OrganizationService,
          useValue: mockOrganizationService,
        },
        {
          provide: AddressService,
          useValue: mockAddressService,
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
