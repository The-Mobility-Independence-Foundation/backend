import { Injectable } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../inventory.entity';
import { Model } from './model/model.entity';

@Injectable()
export class InventoryItemService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,

    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async create() {
      const inventoryItem = new InventoryItem();
      const inventory = await this.inventoryRepository.findOneBy({ id: 1 });
      const model = await this.modelRepository.findOneBy({ id: 1 });

      if (inventory) { inventoryItem.inventory = inventory; }
      if (model) { inventoryItem.model = model; }

      inventoryItem.part = 1;
      inventoryItem.notes = "These are my notes!";
      inventoryItem.attributes = "These are my attributes!";

      return this.inventoryItemRepository.save(inventoryItem);
  }


  async findAll() {
    return this.inventoryItemRepository.find();
  }

  async findOne(id: number) {
    return this.inventoryItemRepository.findOneBy({ id: id });
  }
}
