import { Test, TestingModule } from '@nestjs/testing';
import { InventoryItemService } from './inventory-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItem } from './inventory-item.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Model } from '../model/model.entity';
import { Part } from '../part/part.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('InventoryItemService', () => {
  let service: InventoryItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryItemService,
        {
          provide: getRepositoryToken(InventoryItem),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Model),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Part),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryItemService>(InventoryItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
