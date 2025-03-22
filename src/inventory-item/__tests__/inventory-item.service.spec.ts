import { Test, TestingModule } from '@nestjs/testing';
import { InventoryItemService } from '../inventory-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItem } from '../inventory-item.entity';
import { Inventory } from '../../inventory/inventory.entity';
import { Model } from '../../model/model.entity';
import { Part } from '../../part/part.entity';
//import { PaginationService } from '../../common/services/pagination.service';
//import { ModelService } from '../../model/model.service';
//import { PartService } from '../../part/part.service';
import { createMock } from '@golevelup/ts-jest';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('InventoryItemService', () => {
  let service: InventoryItemService;
  //let paginationService: PaginationService;
  //let partService: PartService;
  //let modelService: ModelService;

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
    })
      .useMocker(createMock)
      .compile();

    service = module.get<InventoryItemService>(InventoryItemService);
    //paginationService = module.get(PaginationService);
    //partService = module.get(PartService);
    //modelService = module.get(ModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
