import { Test, TestingModule } from '@nestjs/testing';
import { InventoryItemController } from '../inventory-item.controller';
import { InventoryItem } from '../inventory-item.entity';
import { Inventory } from '../../inventory/inventory.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItemService } from '../inventory-item.service';
import { Model } from '../../model/model.entity';
import { Part } from '../../part/part.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('InventoryItemController', () => {
  let controller: InventoryItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryItemController],
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

    controller = module.get<InventoryItemController>(InventoryItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
