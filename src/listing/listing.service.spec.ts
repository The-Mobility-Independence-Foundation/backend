import { Test, TestingModule } from '@nestjs/testing';
import { ListingService } from './listing.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { User } from '../user/user.entity';
import { InventoryItem } from '../inventory/inventory-item/inventory-item.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ListingService', () => {
  let service: ListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingService,
        {
          provide: getRepositoryToken(Listing), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(User), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(InventoryItem), 
          useClass: mockRepository
        },
      ]
    }).compile();

    service = module.get<ListingService>(ListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
