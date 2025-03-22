import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../inventory/inventory.entity';
import { Model } from '../model/model.entity';
import { Part } from '../part/part.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
//import { GetInventoryItemsDto } from './dto/get-inventory-item.dto';
import { PartService } from '../part/part.service';
import { ModelService } from '../model/model.service';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class InventoryItemService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,

    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,

    private readonly paginationService: PaginationService,
    private readonly partService: PartService,
    private readonly modelService: ModelService,
  ) {}

  /**
   * Create a new instance of an item
   * @param dto : All necessary information to create a new item
   * @returns : The new item being saved into the database
   */
  async create(dto: CreateInventoryItemDto) {
    const inventoryItem = new InventoryItem();

    const model = await this.modelService.findById(dto.model, {
      relations: ['manufacturer', 'types'],
    });

    const part = await this.partService.findById(dto.part, {
      relations: ['model', 'types'],
    });

    //Change to inventory.findById when PR merged
    const inventory = await this.inventoryRepository.findOneBy({
      id: dto.inventory,
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    inventoryItem.inventory = inventory;

    if (!model) {
      throw new NotFoundException('Model not found');
    }
    inventoryItem.model = model;

    if (!part) {
      throw new NotFoundException('Part not found');
    }
    inventoryItem.part = part;

    inventoryItem.notes = dto.notes;
    inventoryItem.attributes = dto.attributes;
    inventoryItem.quantity = dto.quantity;
    inventoryItem.publicCount = dto.publicCount;

    return this.inventoryItemRepository.save(inventoryItem);
  }

  /**
   * Get a list of all the items being stored in a specific inventory
   * @param organizationId : Organization that owns the inventory
   * @param inventoryId : The iventory where the items are being held
   * @returns : A list of items stored in the inventory
   */
  async findAll(organizationId: number, inventoryId: number) {
    return this.inventoryItemRepository.find({
      where: {
        inventory: {
          id: inventoryId,
          organization: { id: organizationId },
        },
      },
      relations: [
        'inventory',
        'inventory.organization',
        'inventory.address',
        'part.name',
        'model.name',
        'listings',
        'tags.name',
      ],
    });
  }

  /**
   * Find a specific item in an inventory
   * @param organizationId : The organization that owns the inventory
   * @param inventoryId : The inventory where the item is stored
   * @param itemId : The item being looked for
   * @returns : All date of the specific item
   */
  async findOne(organizationId: number, inventoryId: number, itemId: number) {
    const item = await this.inventoryItemRepository.findOne({
      where: {
        id: itemId,
        inventory: {
          id: inventoryId,
          organization: { id: organizationId },
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
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return item;
  }

  /**
   * Update a specific inventory item with the given data
   * @param organizationId : The organization who knows the inventory where the item is
   * @param inventoryId : The inventory where the item is stored
   * @param id : The ID of the specific item
   * @param dto : All the information to be changed
   * @returns : The updated item being saved in the repository
   */
  async update(
    organizationId: number,
    inventoryId: number,
    id: number,
    dto: UpdateInventoryItemDto,
  ) {
    const item = await this.inventoryItemRepository.findOne({
      where: {
        id: id,
        inventory: {
          id: inventoryId,
          organization: { id: organizationId },
        },
      },
      relations: [
        'inventory',
        'inventory.organization',
        'inventory.address',
        'part',
        'model',
        'listings',
        'tags',
      ],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (dto.attributes) {
      item.attributes = dto.attributes;
    }

    const inventory = await this.inventoryRepository.findOneBy({
      id: dto.inventory,
    });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    item.inventory = inventory;

    if (dto.notes) {
      item.notes = dto.notes;
    }

    if (dto.publicCount) {
      item.publicCount = dto.publicCount;
    }

    if (dto.quantity) {
      item.quantity = dto.quantity;
    }

    return await this.inventoryItemRepository.save(item);
  }

  /**
   * Finds a specific inventory item based on the ID given
   * @param id : The ID of the specific inventory item given
   * @param options : Any specific options needed to search
   * @returns : The inventory item and any information
   */
  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<InventoryItem, 'id'>>;
      relations: string[] | FindOptionsRelations<InventoryItem>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    return this.inventoryItemRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });
  }
}
