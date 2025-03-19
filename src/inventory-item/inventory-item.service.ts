import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../inventory/inventory.entity';
import { Model } from '../model/model.entity';
import { Part } from '../part/part.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

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
  ) {}

  /**
   * Create a new instance of an item
   * @param dto : All necessary information to create a new item
   * @returns : The new item being saved into the database
   */
  async create(dto: CreateInventoryItemDto) {
    const inventoryItem = new InventoryItem();

    const model = await this.modelRepository.findOneBy({
      id: dto.model,
    });
    const part = await this.partRepository.findOneBy({
      id: dto.part,
    });
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
}
