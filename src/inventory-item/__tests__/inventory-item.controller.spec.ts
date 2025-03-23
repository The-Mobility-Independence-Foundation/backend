import { Test, TestingModule } from '@nestjs/testing';
import { InventoryItemController } from '../inventory-item.controller';
import { InventoryItem } from '../inventory-item.entity';
import { Inventory } from '../../inventory/inventory.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItemService } from '../inventory-item.service';
import { Model } from '../../model/model.entity';
import { Part } from '../../part/part.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
//import { PaginationService } from '../../common/services/pagination.service';
//import { ModelService } from '../../model/model.service';
//import { PartService } from '../../part/part.service';

describe('InventoryItemController', () => {
  let controller: InventoryItemController;
  //let paginationService: PaginationService;
  //let partService: PartService;
  //let modelService: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryItemController],
      providers: [
        InventoryItemService,
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: createMock<Repository<InventoryItem>>(),
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: createMock<Repository<Inventory>>(),
        },
        {
          provide: getRepositoryToken(Model),
          useValue: createMock<Repository<Model>>(),
        },
        {
          provide: getRepositoryToken(Part),
          useValue: createMock<Repository<Part>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<InventoryItemController>(InventoryItemController);
    //paginationService = module.get(PaginationService);
    //partService = module.get(PartService);
    //modelService = module.get(ModelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
