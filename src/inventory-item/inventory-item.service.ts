import { Injectable } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../inventory/inventory.entity';

@Injectable()
export class InventoryItemService {

    constructor(
        @InjectRepository(InventoryItem)
        private inventoryItemRepository: Repository<InventoryItem>,

        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
    ) {}

    async create() {
        const inventoryItem = new InventoryItem();
        const inventory = await this.inventoryRepository.findOneBy({ id: 1 });

        if (inventory) { inventoryItem.inventory = inventory; }

        inventoryItem.part = 1;
        inventoryItem.model = 1;
        inventoryItem.notes = "These are my notes!";
        inventoryItem.attributes = "These are my attributes!";

        return this.inventoryItemRepository.save(inventoryItem);
    }

    async findAll() {
        
        return this.inventoryItemRepository.find();
        
    }

    async findOne(id: number) {

        return this.inventoryItemRepository.findOneBy({id: id});

    }

}
