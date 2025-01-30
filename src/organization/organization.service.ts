import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../user/user.entity';
import { Inventory } from '../inventory/inventory.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async create() {
    const organization = new Organization();

    const owner = await this.userRepository.findOneBy({ id: 1 });
    const inventory = await this.inventoryRepository.findOneBy({ id: 1 });

    if (inventory) {
      organization.inventories = [inventory];
    }
    if (owner) {
      organization.owner = owner;
    }

    organization.name = 'The Mobility Independence Foundation';
    organization.addressLine1 = '1789 State Highway 8';
    organization.city = 'Mount Upton';
    organization.state = 'New York';
    organization.zipcode = 13809;
    organization.ein = '92-0887459';

    return this.organizationRepository.save(organization);
  }

  async findAll() {
    return this.organizationRepository.find();
  }

  async findOne(id: number) {
    return this.organizationRepository.findOneBy({ id: id });
  }
}
