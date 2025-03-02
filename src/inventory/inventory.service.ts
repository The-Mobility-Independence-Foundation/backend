import { Injectable } from '@nestjs/common';
import { Inventory } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organization/organization.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Address } from '../address/address.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  /**
   * Create a new inventory instance in the database
   * @param dto : Relevant information needed to create the inventory
   * @returns The save of the inventory
   */
  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const inventory = new Inventory();

    const organization = await this.organizationRepository.findOneBy({
      id: dto.organizationId,
    });
    if (!organization) {
      throw new Error('Organization not found');
    }
    inventory.organization = organization;

    const address = await this.addressRepository.findOneBy({
      id: dto.address,
    });
    if (!address) {
      throw new Error('Address not found');
    }
    inventory.address = address;

    inventory.name = dto.name;
    inventory.description = dto.description;

    return this.inventoryRepository.save(inventory);
  }

  /**
   * Find all the inventories owned by a specific organization
   * @param organizationId : The id of the organization
   * @returns A collection of all relevant inventory information owned by this organization
   */
  async findAll(organizationId: number) {
    return this.inventoryRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['organization', 'address', 'items'],
    });
  }

  /**
   * Find a single specific inventory owned by an organization
   * @param id : The id of the organization
   * @param organizationId : Id of the specific organization
   * @returns : Information of a specific inventory
   */
  async findOne(id: number, organizationId: number) {
    return this.inventoryRepository.findOne({
      where: { id: id, organization: { id: organizationId } },
      relations: ['organization', 'address', 'items'],
    });
  }

  /**
   *
   * @param organizationId
   * @param id
   * @param dto
   */
  async update(organizationId: number, id: number, dto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.findOneBy({ id: id });

    if (!inventory) {
      throw new Error('Inventory not found');
    }

    const address = await this.addressRepository.findOneBy({
      id: dto.address,
    });
    if (!address) {
      throw new Error('Address not found');
    }
    inventory.address = address;

    if (dto.description) {
      inventory.description = dto.description;
    }

    if (dto.name) {
      inventory.name = dto.name;
    }

    return await this.inventoryRepository.save(inventory);
  }
}
