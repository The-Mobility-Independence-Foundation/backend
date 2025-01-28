import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Organization } from '../organization/organization.entity';
import { InventoryService } from './inventory.service';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

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
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
