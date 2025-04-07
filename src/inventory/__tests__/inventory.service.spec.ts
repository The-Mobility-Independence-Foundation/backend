import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from '../inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '../inventory.entity';
import { Organization } from '../../organization/organization.entity';
import { Address } from '../../address/address.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { when } from 'jest-when';
import { PaginationService } from '../../common/services/pagination.service';
import { GetInventoriesDto } from '../dto/get-inventory.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { OrganizationService } from '../../organization/organization.service';
import { InventoryItem } from '../../inventory-item/inventory-item.entity';
import { STRATEGY_PROVIDERS_TOKEN, ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('InventoryService', () => {
  let service: InventoryService;
  let inventoryRepository: Repository<Inventory>;
  let paginationService: PaginationService;
  let organizationService: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: createMock<Repository<Inventory>>(),
        },
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(InventoryService);
    paginationService = module.get(PaginationService);
    organizationService = module.get(OrganizationService);
    inventoryRepository = module.get(getRepositoryToken(Inventory));
  });

  describe('findOne', () => {
    it('should return an inventory if an inventory with the id exists', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 1,
        addressLine1: '42 West Street',
        city: 'Rochester',
        state: 'NY',
        zipCode: '10573',
      });

      const organization = new Organization();
      Object.assign(organization, {
        id: 1,
        name: 'Acme Corp',
        address,
      });

      const inventory = new Inventory();
      Object.assign(inventory, {
        id: 1,
        organization,
        name: '42 West Inventory',
        description: 'Inventory on 42 West',
        address,
      });

      when(inventoryRepository.findOne)
        .calledWith(
          expect.objectContaining({
            where: { id: inventory.id, organization: { id: 1 } },
          }),
        )
        .mockResolvedValue(inventory);

      const result = await service.findWithOrganization(inventory.id, 1);

      expect(result).toBeDefined();
      expect(result).toEqual(inventory);
    });

    it('should return an error if an inventory without the id exists', async () => {
      const bad_id = 999999999;

      when(inventoryRepository.findOne)
        .calledWith({
          where: { id: bad_id, organization: { id: 1 } },
          relations: ['organization', 'address', 'items'],
        })
        .mockResolvedValue(null);

      await expect(service.findWithOrganization(bad_id, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('findAll', () => {
    it('should use name when name is specified', async () => {
      const dto = new GetInventoriesDto();
      Object.assign(dto, {
        name: 'Sample Inventory',
      });

      service.findAll(1, dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        inventoryRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: {
            name: dto.name,
            organization: { id: 1 },
          },
          cursorColumn: 'id',
        }),
      );
    });

    it('should apply pagination parameters correctly', async () => {
      const dto = new GetInventoriesDto();
      Object.assign(dto, {
        cursor: '12345',
        limit: 10,
        direction: 'forward',
      });

      service.findAll(1, dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        inventoryRepository,
        expect.objectContaining({
          cursor: dto.cursor,
          limit: dto.limit,
          direction: dto.direction,
        }),
        expect.objectContaining({
          where: { organization: { id: 1 } },
        }),
      );
    });

    it('should handle both filters and pagination together', async () => {
      const dto = new GetInventoriesDto();
      Object.assign(dto, {
        name: 'Sample Inventory',
        cursor: '12345',
        limit: 10,
        direction: 'forward',
      });

      service.findAll(1, dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        inventoryRepository,
        expect.objectContaining({
          cursor: dto.cursor,
          limit: dto.limit,
          direction: dto.direction,
        }),
        expect.objectContaining({
          where: {
            name: dto.name,
            organization: { id: 1 },
          },
        }),
      );
    });
  });
  describe('create', () => {
    it('should create a new inventory with a create inventory DTO', async () => {
      const createDto = new CreateInventoryDto();
      Object.assign(createDto, {
        name: '42 West Inventory',
        description: 'Main inventory',
      });

      const address = new Address();
      Object.assign(address, { id: 1 });

      const organization = new Organization();
      Object.assign(organization, { id: 1, address: address });

      const savedInventory = new Inventory();
      Object.assign(savedInventory, {
        id: 1,
        organization,
        name: createDto.name,
        description: createDto.description,
      });

      when(organizationService.findByIdOrThrow)
        .calledWith(organization.id, {
          relations: {
            address: true,
          },
        })
        .mockResolvedValue(organization);

      when(inventoryRepository.save)
        .calledWith(expect.any(Inventory))
        .mockResolvedValue(savedInventory);

      const result = await service.create(organization.id, createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.description).toBe(createDto.description);
    });

    it('should throw NotFoundException if organization is not found', async () => {
      const createDto = new CreateInventoryDto();
      const bad_id = 999999999;
      Object.assign(createDto, {
        name: '42 West Inventory',
        description: 'Main inventory',
      });

      when(organizationService.findByIdOrThrow)
        .calledWith(bad_id, {
          relations: {
            address: true,
          },
        })
        .mockRejectedValue(new NotFoundException('Organization not found.'));

      await expect(service.create(bad_id, createDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(organizationService.findByIdOrThrow).toHaveBeenCalledWith(bad_id, {
        relations: {
          address: true,
        },
      });
    });
  });
  describe('update', () => {
    it('should update the name of an inventory with a update inventory DTO', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 2,
        addressLine1: '56 Highland Street',
        city: 'Binghamton',
        state: 'NY',
        zipCode: '14627',
      });

      const organization = new Organization();
      Object.assign(organization, {
        id: 1,
        name: 'Acme Corp',
        address,
      });

      const inventory = new Inventory();
      Object.assign(inventory, {
        id: 1,
        organization,
        name: '42 West Inventory',
        description: 'Inventory on 42 West',
        address,
      });

      const dto = new UpdateInventoryDto();
      Object.assign(dto, {
        name: '53 West Inventory',
      });

      when(inventoryRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: inventory.id } }))
        .mockResolvedValue(Promise.resolve(inventory));

      when(inventoryRepository.save)
        .calledWith(expect.any(Inventory))
        .mockResolvedValue({
          ...inventory,
        });

      const result = await service.update(
        inventory.organization.id,
        inventory.id,
        dto,
      );

      expect(result).toBeDefined();
    });
    it('should update the description of an inventory with a update inventory DTO', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 2,
        addressLine1: '56 Highland Street',
        city: 'Binghamton',
        state: 'NY',
        zipCode: '14627',
      });

      const organization = new Organization();
      Object.assign(organization, {
        id: 1,
        name: 'Acme Corp',
        address,
      });

      const inventory = new Inventory();
      Object.assign(inventory, {
        id: 1,
        organization,
        name: '42 West Inventory',
        description: 'Inventory on 42 West',
        address,
      });

      const dto = new UpdateInventoryDto();
      Object.assign(dto, {
        description: 'Main Inventory',
      });

      when(inventoryRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: inventory.id } }))
        .mockResolvedValue(Promise.resolve(inventory));

      when(inventoryRepository.save)
        .calledWith(expect.any(Inventory))
        .mockResolvedValue({
          ...inventory,
        });

      const result = await service.update(
        inventory.organization.id,
        inventory.id,
        dto,
      );

      expect(result).toBeDefined();
    });
  });
  describe('delete', () => {
    it('should not delete an inventory with items in it', async () => {
      const inventory = new Inventory();
      const inventoryItem = new InventoryItem();
      const dummyOrgId = 1;

      Object.assign(inventory, {
        id: 1,
        items: [inventoryItem],
      });

      when(inventoryRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: inventory.id } }))
        .mockResolvedValue(inventory);

      expect(service.delete(dummyOrgId, inventory.id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should delete the inventory if its empty', async () => {
      const inventory = new Inventory();
      const dummyOrgId = 1;

      Object.assign(inventory, {
        id: 1,
        items: [],
      });

      when(inventoryRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: inventory.id } }))
        .mockResolvedValue(inventory);

      expect(service.delete(dummyOrgId, inventory.id)).resolves.not.toThrow();
    });
  });
});
