import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from '../inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '../inventory.entity';
import { Organization } from '../../organization/organization.entity';
import { Address } from '../../address/address.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('InventoryService', () => {
  let service: InventoryService;
  let inventoryRepository: Repository<Inventory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: createMock<Repository<Organization>>(),
        },
        {
          provide: getRepositoryToken(Address),
          useValue: createMock<Repository<Address>>(),
        },
      ],
    }).compile();

    service = module.get(InventoryService);
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

      jest.spyOn(inventoryRepository, 'findOne').mockResolvedValue(inventory);

      const result = await service.findOne(inventory.id, 1);

      expect(result).toBeDefined();
      expect(result).toEqual(inventory);
    });

    it('should return an error if an inventory without the id exists', async () => {
      const bad_id = 999999999;

      jest.spyOn(inventoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(bad_id, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of inventories with the organization id', async () => {
      const address1 = new Address();
      Object.assign(address1, {
        id: 1,
        addressLine1: '42 West Street',
        city: 'Rochester',
        state: 'NY',
        zipCode: '10573',
      });

      const address2 = new Address();
      Object.assign(address2, {
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
        address1,
      });

      const inventory1 = new Inventory();
      Object.assign(inventory1, {
        id: 1,
        organization,
        name: '42 West Inventory',
        description: 'Inventory on 42 West',
        address1,
      });

      const inventory2 = new Inventory();
      Object.assign(inventory2, {
        id: 2,
        organization,
        name: 'Binghamton Inventory',
        description: 'Secondary inventory',
        address2,
      });

      jest
        .spyOn(inventoryRepository, 'find')
        .mockResolvedValue([inventory1, inventory2]);

      const result = await service.findAll(1);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result).toEqual([inventory1, inventory2]);

      expect(inventoryRepository.find).toHaveBeenCalledWith({
        where: { organization: { id: 1 } },
        relations: ['organization', 'address', 'items'],
      });
    });
    it('Should return an empty list if the organization has no inventories', async () => {
      const address1 = new Address();
      Object.assign(address1, {
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
        address1,
      });

      jest.spyOn(inventoryRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll(1);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);

      expect(inventoryRepository.find).toHaveBeenCalledWith({
        where: { organization: { id: 1 } },
        relations: ['organization', 'address', 'items'],
      });
    });
  });
  describe('create', () => {
    it('should create a new inventory with a create inventory DTO', async () => {
      const createDto = new CreateInventoryDto();
      Object.assign(createDto, {
        organizationId: 1,
        name: '42 West Inventory',
        description: 'Main inventory',
        address: 1,
      });

      const address = new Address();
      Object.assign(address, { id: 1 });

      const organization = new Organization();
      Object.assign(organization, { id: 1 });

      const savedInventory = new Inventory();
      Object.assign(savedInventory, {
        id: 1,
        organization,
        name: createDto.name,
        description: createDto.description,
        address,
      });

      inventoryRepository.save = jest.fn().mockResolvedValue(savedInventory);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.organization.id).toBe(createDto.organizationId);
      expect(result.name).toBe(createDto.name);
      expect(result.description).toBe(createDto.description);
      expect(result.address.id).toBe(createDto.address);
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

      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(inventory);

      inventoryRepository.save = jest.fn().mockResolvedValue(inventory);

      const result = await service.update(
        inventory.organization.id,
        inventory.id,
        dto,
      );

      expect(result).toBeDefined();
      expect(result.organization.id).toBe(inventory.organization.id);
      expect(result.name).toBe(dto.name);
      expect(result.address.id).toBe(inventory.address.id);
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

      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(inventory);

      inventoryRepository.save = jest.fn().mockResolvedValue(inventory);

      const result = await service.update(
        inventory.organization.id,
        inventory.id,
        dto,
      );

      expect(result).toBeDefined();
      expect(result.organization.id).toBe(inventory.organization.id);
      expect(result.name).toBe(inventory.name);
      expect(result.description).toBe(dto.description);
      expect(result.address.id).toBe(inventory.address.id);
    });
  });
});
