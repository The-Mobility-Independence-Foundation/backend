import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../user/entities/user.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Address } from '../address/address.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,

    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create() {
    const organization = new Organization();

    const owner = await this.userRepository.findOneBy({ id: 1 });
    const inventory = await this.inventoryRepository.findOneBy({ id: 1 });
    const address = await this.addressRepository.findOneBy({ id: 1 });

    if (inventory) {
      organization.inventories = [inventory];
    }
    if (owner) {
      organization.owner = owner;
    }
    if (address) {
      organization.address = address;
    }

    organization.name = 'The Mobility Independence Foundation';
    organization.ein = '92-0887459';

    return this.organizationRepository.save(organization);
  }

  async findAll() {
    return this.organizationRepository.find();
  }

  async findOne(id: number) {
    return this.organizationRepository.findOneBy({ id: id });
  }

  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Organization, 'id'>>;
      relations: string[] | FindOptionsRelations<Organization>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    return this.organizationRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });
  }
}
