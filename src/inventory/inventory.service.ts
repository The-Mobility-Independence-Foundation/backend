import { Injectable } from '@nestjs/common';
import { Inventory } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from 'src/organization/organization.entity';

@Injectable()
export class InventoryService {

    constructor(
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,

        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
    ) {}

    async create() {
        const inventory = new Inventory();
        const organization = await this.organizationRepository.findOneBy({id: 1});
        if (organization) {
            inventory.description = "Test Description";
            inventory.name = "Test Name";
            inventory.location = "Test Location";
            inventory.organization = organization;
            inventory.parentInventory = 0;
        }

        return this.inventoryRepository.save(inventory);
    }

    async findAll() {
        
        return this.inventoryRepository.find();
        
    }

    async findOne(id: number) {

        return this.inventoryRepository.findOneBy({id: id});

    }
}
