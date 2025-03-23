import { Test, TestingModule } from '@nestjs/testing';
import { InventoryItemService } from '../inventory-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItem } from '../inventory-item.entity';
import { Inventory } from '../../inventory/inventory.entity';
import { Model } from '../../model/model.entity';
import { Part } from '../../part/part.entity';
//import { PaginationService } from '../../common/services/pagination.service';
import { ModelService } from '../../model/model.service';
import { PartService } from '../../part/part.service';
import { createMock } from '@golevelup/ts-jest';
import { InventoryService } from '../../inventory/inventory.service';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { Tag } from '../../tag/tag.entity';
import { Repository } from 'typeorm';
import { when } from 'jest-when';
import { NotFoundException } from '@nestjs/common';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('InventoryItemService', () => {
  let service: InventoryItemService;
  let inventoryItemRepository : Repository<InventoryItem>;
  //let paginationService: PaginationService;
  let partService: PartService;
  let modelService: ModelService;
  let inventoryService: InventoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryItemService,
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: createMock<Repository<InventoryItem>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<InventoryItemService>(InventoryItemService);
    inventoryItemRepository = module.get(getRepositoryToken(InventoryItem));
    //paginationService = module.get(PaginationService);
    partService = module.get(PartService);
    modelService = module.get(ModelService);
    inventoryService = module.get(InventoryService);
  });

  describe('create', () => {
    let createDto = new CreateInventoryItemDto();
    let part = new Part();
    let model = new Model();
    let tag = new Tag();
    let inventory = new Inventory();

    beforeAll(() => {
      Object.assign(part, { id: 1 });
      Object.assign(model, { id: 1 });
      Object.assign(tag, { id: 1 });
      Object.assign(inventory, { id: 1 });
    })

    beforeEach(()=> {
      createDto = new CreateInventoryItemDto();
    });

    it('should create a new inventory with a create inventory DTO', async () => {
      Object.assign(createDto,{
        part: 1,
        model: 1,
        inventory: 1,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel'
      });

      when(inventoryService.findByIdOrThrow)
        .calledWith(createDto.inventory, {
          relations: ['address', 'user', 'inventory'],
        })
        .mockResolvedValue(inventory);

      when(partService.findByIdOrThrow)
        .calledWith(createDto.part)
        .mockResolvedValue(part);

      when(modelService.findByIdOrThrow)
        .calledWith(createDto.model)
        .mockResolvedValue(model);

      await expect(service.create(createDto)).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });
    it('should throw NotFoundException if Part is not found', async () => {
      Object.assign(createDto,{
        part: 999,
        model: 1,
        inventory: 1,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel'
      });

      when(partService.findByIdOrThrow)
        .calledWith(createDto.part, expect.any(Object))
        .mockRejectedValue(new NotFoundException('Part not found.'));

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(partService.findByIdOrThrow).toHaveBeenCalledWith(
        createDto.part,
        expect.any(Object),
      );
    });
    it('should throw NotFoundException if Model is not found', async () => {
      Object.assign(createDto,{
        part: 1,
        model: 999,
        inventory: 1,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel'
      });

      when(modelService.findByIdOrThrow)
        .calledWith(createDto.model, expect.any(Object))
        .mockRejectedValue(new NotFoundException('Model not found.'));

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(modelService.findByIdOrThrow).toHaveBeenCalledWith(
        createDto.model,
        expect.any(Object),
      );
    });
    it('should throw NotFoundException if Inventory is not found', async () => {
      Object.assign(createDto,{
        part: 1,
        model: 1,
        inventory: 878,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel'
      });

      when(inventoryService.findByIdOrThrow)
        .calledWith(createDto.inventory, expect.any(Object))
        .mockRejectedValue(new NotFoundException('Inventory not found.'));

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(inventoryService.findByIdOrThrow).toHaveBeenCalledWith(
        createDto.inventory,
        expect.any(Object),
      );
    });
  });
});
