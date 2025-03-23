import { Test, TestingModule } from '@nestjs/testing';
import { InventoryItemService } from '../inventory-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItem } from '../inventory-item.entity';
import { Inventory } from '../../inventory/inventory.entity';
import { Model } from '../../model/model.entity';
import { Part } from '../../part/part.entity';
import { PaginationService } from '../../common/services/pagination.service';
import { ModelService } from '../../model/model.service';
import { PartService } from '../../part/part.service';
import { createMock } from '@golevelup/ts-jest';
import { InventoryService } from '../../inventory/inventory.service';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { Tag } from '../../tag/tag.entity';
import { Repository } from 'typeorm';
import { when } from 'jest-when';
import { NotFoundException } from '@nestjs/common';
import { GetInventoryItemsDto } from '../dto/get-inventory-item.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';

describe('InventoryItemService', () => {
  let service: InventoryItemService;
  let inventoryItemRepository: Repository<InventoryItem>;
  let paginationService: PaginationService;
  let partService: PartService;
  let modelService: ModelService;
  let inventoryService: InventoryService;

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
    paginationService = module.get(PaginationService);
    partService = module.get(PartService);
    modelService = module.get(ModelService);
    inventoryService = module.get(InventoryService);
  });

  describe('create', () => {
    let createDto = new CreateInventoryItemDto();
    const part = new Part();
    const model = new Model();
    const tag = new Tag();
    const inventory = new Inventory();

    beforeAll(() => {
      Object.assign(part, { id: 1 });
      Object.assign(model, { id: 1 });
      Object.assign(tag, { id: 1 });
      Object.assign(inventory, { id: 1 });
    });

    beforeEach(() => {
      createDto = new CreateInventoryItemDto();
    });

    it('should create a new inventory item with a DTO', async () => {
      Object.assign(createDto, {
        part: 1,
        model: 1,
        inventory: 1,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel',
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
      Object.assign(createDto, {
        part: 999,
        model: 1,
        inventory: 1,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel',
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
      Object.assign(createDto, {
        part: 1,
        model: 999,
        inventory: 1,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel',
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
      Object.assign(createDto, {
        part: 1,
        model: 1,
        inventory: 878,
        quantity: 3,
        publicCount: 2,
        notes: 'nice wheel',
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

  describe('findAll', () => {
    let getDto = new GetInventoryItemsDto();
    const part = new Part();
    const model = new Model();
    const itemTag = new Tag();

    beforeAll(() => {
      Object.assign(part, { id: 1 });
      Object.assign(model, { id: 1 });
      Object.assign(itemTag, { id: 1 });
    });

    beforeEach(() => {
      getDto = new GetInventoryItemsDto();
    });

    it('should use tag search when a tag is specified', async () => {
      Object.assign(getDto, {
        tag: itemTag.id,
      });

      service.findAll(1, 1, getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        inventoryItemRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: {
            inventory: {
              id: 1,
              organization: { id: 1 },
            },
            tags: { some: { id: getDto.tag } },
          },
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should use part search when a part is specified', async () => {
      Object.assign(getDto, {
        part: part.id,
      });

      service.findAll(1, 1, getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        inventoryItemRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: {
            inventory: {
              id: 1,
              organization: { id: 1 },
            },
            part: getDto.part,
          },
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should use model search when a model is specified', async () => {
      Object.assign(getDto, {
        model: model.id,
      });

      service.findAll(1, 1, getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        inventoryItemRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: {
            inventory: {
              id: 1,
              organization: { id: 1 },
            },
            model: getDto.model,
          },
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should apply pagination parameters correctly', async () => {
      Object.assign(getDto, {
        cursor: '12345',
        limit: 10,
        direction: 'forward',
      });

      service.findAll(1, 1, getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        inventoryItemRepository,
        expect.objectContaining({
          cursor: getDto.cursor,
          limit: getDto.limit,
          direction: getDto.direction,
        }),
        expect.objectContaining({
          where: {
            inventory: {
              id: 1,
              organization: { id: 1 },
            },
          },
        }),
      );
    });
  });

  describe('update', () => {
    let updateDto = new UpdateInventoryItemDto();
    const item = new InventoryItem();
    const part = new Part();
    const model = new Model();
    const itemTag = new Tag();
    const newinventory = new Inventory();

    beforeAll(() => {
      Object.assign(part, { id: 1 });
      Object.assign(model, { id: 1 });
      Object.assign(itemTag, { id: 1 });
      Object.assign(newinventory, { id: 2 });
      Object.assign(item, {
        id: 1,
        part: 5,
        model: 6,
        inventory: 1,
        quantity: 2,
        publicCount: 1,
        notes: 'Bike be bitching',
        attributes: {
          color: 'red',
          size: 'M',
          weight: 15,
        },
      });
    });

    beforeEach(() => {
      updateDto = new UpdateInventoryItemDto();
    });

    it('Should update the part of an inventory item if specified', async () => {
      Object.assign(updateDto, {
        part: part,
      });

      when(inventoryItemRepository.findOneBy)
        .calledWith({ id: item.id })
        .mockResolvedValue(item);

      when(partService.findByIdOrThrow)
        .calledWith(part.id)
        .mockResolvedValue(part);

      await expect(
        service.update(1, 1, item.id, updateDto),
      ).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });
    it('Should update the model of an inventory item if specified', async () => {
      Object.assign(updateDto, {
        model: model,
      });

      when(inventoryItemRepository.findOneBy)
        .calledWith({ id: item.id })
        .mockResolvedValue(item);

      when(modelService.findByIdOrThrow)
        .calledWith(model.id)
        .mockResolvedValue(model);

      await expect(
        service.update(1, 1, item.id, updateDto),
      ).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });

    it('Should update the inventory of an inventory item if specified', async () => {
      Object.assign(updateDto, {
        inventory: newinventory,
      });

      when(inventoryItemRepository.findOneBy)
        .calledWith({ id: item.id })
        .mockResolvedValue(item);

      when(inventoryService.findByIdOrThrow)
        .calledWith(newinventory.id)
        .mockResolvedValue(newinventory);

      await expect(
        service.update(1, 1, item.id, updateDto),
      ).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });

    it('Should update the total quantity of an inventory item if specified', async () => {
      Object.assign(updateDto, {
        quantity: 4,
      });

      when(inventoryItemRepository.findOneBy)
        .calledWith({ id: item.id })
        .mockResolvedValue(item);

      await expect(
        service.update(1, 1, item.id, updateDto),
      ).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });

    it('Should update the public count quantity of an inventory item if specified', async () => {
      Object.assign(updateDto, {
        publicCount: 3,
      });

      when(inventoryItemRepository.findOneBy)
        .calledWith({ id: item.id })
        .mockResolvedValue(item);

      await expect(
        service.update(1, 1, item.id, updateDto),
      ).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });

    it('Should update the notes of an inventory item if specified', async () => {
      Object.assign(updateDto, {
        notes: 'This bike is cool',
      });

      when(inventoryItemRepository.findOneBy)
        .calledWith({ id: item.id })
        .mockResolvedValue(item);

      await expect(
        service.update(1, 1, item.id, updateDto),
      ).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });

    it('Should update the attributes of an inventory item if specified', async () => {
      Object.assign(updateDto, {
        attributes: { height: 13, width: 10, gearCount: 6 },
      });

      when(inventoryItemRepository.findOneBy)
        .calledWith({ id: item.id })
        .mockResolvedValue(item);

      await expect(
        service.update(1, 1, item.id, updateDto),
      ).resolves.not.toThrow();
      expect(inventoryItemRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const item = new InventoryItem();

    beforeAll(() => {
      Object.assign(item, {
        inventory: {
          id: 1,
          organization: { id: 1 },
        },
      });
    });

    it('Should return an item if the item exists', async () => {
      when(inventoryItemRepository.findOne)
        .calledWith({
          where: {
            id: item.id,
            inventory: {
              id: 1,
              organization: { id: 1 },
            },
          },
          relations: [
            'inventory',
            'inventory.organization',
            'inventory.address',
            'part.name',
            'part.partNumber',
            'model.name',
            'listings',
            'tags.name',
          ],
        })
        .mockResolvedValue(item);

      const result = await service.findWithOrgInv(1, 1, item.id);

      expect(result).toBeDefined();
    });

    it('Should throw a NotFoundException if the item does not exist', async () => {
      const bad_id = 999999999;

      when(inventoryItemRepository.findOne)
        .calledWith({
          where: {
            id: bad_id,
            inventory: {
              id: 1,
              organization: { id: 1 },
            },
          },
          relations: [
            'inventory',
            'inventory.organization',
            'inventory.address',
            'part.name',
            'part.partNumber',
            'model.name',
            'listings',
            'tags.name',
          ],
        })
        .mockResolvedValue(null);

      await expect(service.findWithOrgInv(1, 1, bad_id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should throw a NotFoundException if the inventory does not exist', async () => {
      when(inventoryItemRepository.findOne)
        .calledWith({
          where: {
            id: item.id,
            inventory: {
              id: 2,
              organization: { id: 1 },
            },
          },
          relations: [
            'inventory',
            'inventory.organization',
            'inventory.address',
            'part.name',
            'part.partNumber',
            'model.name',
            'listings',
            'tags.name',
          ],
        })
        .mockResolvedValue(null);

      await expect(service.findWithOrgInv(1, 2, item.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should throw a NotFoundException if the organization does not exist', async () => {
      when(inventoryItemRepository.findOne)
        .calledWith({
          where: {
            id: item.id,
            inventory: {
              id: 1,
              organization: { id: 2 },
            },
          },
          relations: [
            'inventory',
            'inventory.organization',
            'inventory.address',
            'part.name',
            'part.partNumber',
            'model.name',
            'listings',
            'tags.name',
          ],
        })
        .mockResolvedValue(null);

      await expect(service.findWithOrgInv(2, 1, item.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
