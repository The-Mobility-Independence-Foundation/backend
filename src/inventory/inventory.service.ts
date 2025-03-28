import { Injectable, NotFoundException } from '@nestjs/common';
import { Inventory } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
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

    const organization = await this.organizationService.findByIdOrThrow(
      dto.organizationId,
    );
    inventory.organization = organization;

    const address = await this.addressService.findByIdOrThrow(dto.address);
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
  async findWithOrganization(
    id: number,
    organizationId: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Inventory, 'id'>>;
      relations: FindOptionsRelations<Inventory>;
    }> = {},
  ) {
    const { where = {}, relations = ['organization', 'address', 'items'] } =
      options;

    const inventory = await this.findByIdOrThrow(id, {
      where: {
        organization: { id: organizationId },
        ...where, // Spread other conditions from the 'where' object
      },
      relations,
    });

    return inventory;
  }

  /**
   * Update a pre-existing invenotry
   * @param organizationId : The id of the organization
   * @param id : The id of the inventory that wants to change
   * @param dto : The updated information
   */
  async update(organizationId: number, id: number, dto: UpdateInventoryDto) {
    const inventory = await this.findByIdOrThrow(id, {
      relations: ['organization', 'address', 'items'],
    });

    Object.assign(inventory, {
      ...(dto.name && { name: dto.name }), // Only update name if it's in the DTO
      ...(dto.description && { description: dto.description }), // Only update description if it's in the DTO
    });

    return await this.inventoryRepository.save(inventory);
  }

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Inventory, 'id'>>;
      relations: string[] | FindOptionsRelations<Inventory>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const inventory = await this.inventoryRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (inventory) {
      return inventory;
    } else {
      throw new NotFoundException('Inventory not found');
    }
  }
}
