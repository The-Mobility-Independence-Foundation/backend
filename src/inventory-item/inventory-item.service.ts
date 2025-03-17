import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../inventory/inventory.entity';
import { Model } from '../model/model.entity';
import { Part } from '../part/part.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
//import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

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

  async create(dto: CreateInventoryItemDto) {
    const inventoryItem = new InventoryItem();
    const model = await this.modelRepository.findOneBy({ id: 1 });
    const part = await this.partRepository.findOneBy({ id: 1 });
    const inventory = await this.inventoryRepository.findOneBy({
      id: dto.inventory,
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    inventoryItem.inventory = inventory;
    
    if (model) {
      inventoryItem.model = model;
    }
    if (part) {
      inventoryItem.part = part;
    }

    inventoryItem.notes = 'These are my notes!';
    inventoryItem.attributes = { size: 100 };

    return this.inventoryItemRepository.save(inventoryItem);
  }

  async findAll() {
    return this.inventoryItemRepository.find();
  }

  async findOne(id: number) {
    return this.inventoryItemRepository.findOneBy({ id: id });
  }

  /**
  async update(
    organizationId: number,
    inventoryId: number,
    id: number,
    dto: UpdateInventoryItemDto,
  ) {
    return ;
  }
  */
}
