import { Injectable } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InventoryItemService {

    constructor(
        @InjectRepository(InventoryItem)
        private inventoryItemRepository: Repository<InventoryItem>,
    ) {}

    async create() {
        const inventoryItem = new InventoryItem();
        inventoryItem.partID = 1;
        inventoryItem.modelID = 1;
        inventoryItem.inventoryID = 1;
        inventoryItem.notes = "These are my notes!";
        inventoryItem.attributes = "These are my attributes!";

        return this.inventoryItemRepository.save(inventoryItem);
    }

    async findAll() {
        
        return this.inventoryItemRepository.find();
        
    }

    async findOne(id: number) {

        return this.inventoryItemRepository.findOneBy({inventoryItemID: id});

    }

}
