import { Injectable, NotFoundException } from '@nestjs/common';
import { Inventory } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Organization } from '../organization/organization.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Address } from '../address/address.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PaginationService } from '../common/services/pagination.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { GetInventoriesDto } from './dto/get-inventory.dto';
import { OrganizationService } from '../organization/organization.service';
import { AddressService } from '../address/address.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    private readonly paginationService: PaginationService,
    private readonly organizationService: OrganizationService,
    private readonly addressService: AddressService,
  ) {}

  /**
   * Create a new inventory instance in the database
   * @param dto : Relevant information needed to create the inventory
   * @returns The save of the inventory
   */
  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const inventory = new Inventory();

    const organization = await this.organizationService.findById(
      dto.organizationId,
      {
        relations: ['address', 'user', 'inventory'],
      },
    );
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    inventory.organization = organization;

    const address = await this.addressService.findById(dto.address);
    if (!address) {
      throw new NotFoundException('Address not found');
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
  async findAll(organizationId: number, query: GetInventoriesDto) {
    const findWhere: any = {
      organization: { id: organizationId },
      name: query.name,
    };
    const paginationDto = new CursorPaginationDto();

    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    return this.paginationService.paginateWithCursor(
      this.inventoryRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
      },
    );
  }

  /**
   * Find a single specific inventory owned by an organization
   * @param id : The id of the organization
   * @param organizationId : Id of the specific organization
   * @returns : Information of a specific inventory
   */
  async findOne(
    id: number,
    organizationId: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Inventory, 'id'>>;
      relations: FindOptionsRelations<Inventory>;
    }> = {},
  ) {
    const { where = {}, relations = ['organization', 'address', 'items'] } =
      options;

    const inventory = await this.inventoryRepository.findOne({
      where: {
        ...where,
        id,
        organization: { id: organizationId },
      },
      relations,
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  /**
   * Update a pre-existing invenotry
   * @param organizationId : The id of the organization
   * @param id : The id of the inventory that wants to change
   * @param dto : The updated information
   */
  async update(organizationId: number, id: number, dto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['organization', 'address', 'items'],
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (dto.description) {
      inventory.description = dto.description;
    }

    if (dto.name) {
      inventory.name = dto.name;
    }

    return await this.inventoryRepository.save(inventory);
  }
}
