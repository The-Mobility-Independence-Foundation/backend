import { Injectable } from '@nestjs/common';
import { Inventory } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {

    constructor(
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
    ) {}

    async create() {
        const inventory = new Inventory();
        inventory.description = "Test Description";
        inventory.name = "Test Name";
        inventory.location = "Test Location";
        inventory.organizationID = 1;
        inventory.parentInventoryID = 0;

        return this.inventoryRepository.save(inventory);
    }

    async findAll() {
        
        return this.inventoryRepository.find();
        
    }

    async findOne(id: number) {

        return this.inventoryRepository.findOneBy({inventoryID: id});

    }
}
