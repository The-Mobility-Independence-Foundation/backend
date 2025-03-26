import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from '../inventory.controller';
import { createMock } from '@golevelup/ts-jest';
import {
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('InventoryController', () => {
  let controller: InventoryController;
  //let paginationService: PaginationService;
  //let organizationService: OrganizationService;
  //let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
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
