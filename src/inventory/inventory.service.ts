import { Injectable } from '@nestjs/common';
import { Inventory } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organization/organization.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create() {
    const inventory = new Inventory();
    const organization = await this.organizationRepository.findOneBy({ id: 1 });

    if (organization) {
      inventory.organization = organization;
      inventory.addressLine1 = organization.addressLine1;
      inventory.city = organization.city;
      inventory.state = organization.state;
      inventory.zipcode = organization.zipcode;
    }

    inventory.description = 'Test Description';
    inventory.name = 'Test Name';

    return this.inventoryRepository.save(inventory);
  }

  async findAll() {
    return this.inventoryRepository.find();
  }

  async findOne(id: number) {
    return this.inventoryRepository.findOneBy({ id: id });
  }
}
