import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Inventory } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PaginationService } from '../common/services/pagination.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { GetInventoriesDto } from './dto/get-inventory.dto';
import { OrganizationService } from '../organization/organization.service';
import { AddressService } from '../address/address.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { CursorPaginationOptions } from '../common/interfaces/cursor-pagination-options.interface';

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
  async create(orgId: number, dto: CreateInventoryDto): Promise<Inventory> {
    const inventory = new Inventory();
    const addressData = new CreateAddressDto();

    const organization = await this.organizationService.findByIdOrThrow(orgId, {
      relations: {
        address: true,
      },
    });
    inventory.organization = organization;

    Object.assign(addressData, {
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
    });

    if (Object.values(addressData).every((v) => v !== undefined)) {
      // if every value is defined
      inventory.address = await this.addressService.create(addressData);
    } else if (Object.values(addressData).every((v) => v === undefined)) {
      // if every value is undefined
      inventory.address = organization.address;
    } else {
      throw new BadRequestException('Incomplete address data provided.');
    }

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
    const findWhere = {};
    const paginationDto = new CursorPaginationDto();

    Object.assign(findWhere, {
      organization: { id: organizationId },
      name: query.name,
    });

    if (query.archived === 'true') {
      Object.assign(findWhere, {
        archivedAt: Not(IsNull()),
      });
    }

    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    const cursorOptions: CursorPaginationOptions<Inventory> = {
      cursorColumn: 'id',
      where: findWhere,
      relations: {
        address: true,
      },
    };

    if (query.archived === undefined || query.archived === 'true') {
      cursorOptions.withDeleted = true;
    }

    return this.paginationService.paginateWithCursor(
      this.inventoryRepository,
      paginationDto,
      cursorOptions,
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
      relations: { address: true },
    });

    if (
      dto.addressLine1 ||
      dto.addressLine2 ||
      dto.city ||
      dto.state ||
      dto.zipCode
    ) {
      const oldAddress = inventory.address;
      const addressData = new CreateAddressDto();

      Object.assign(addressData, {
        addressLine1: oldAddress.addressLine1,
        addressLine2: oldAddress.addressLine2,
        city: oldAddress.city,
        state: oldAddress.state,
        zipCode: oldAddress.zipCode,
      });

      Object.assign(addressData, {
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        zipCode: dto.zipCode,
      });

      const address = await this.addressService.create(addressData);
      inventory.address = address;
    }

    Object.assign(inventory, {
      name: dto.name,
      description: dto.description,
    });

    if (dto.restore) {
      return await this.inventoryRepository.restore(id);
    }

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
      withDeleted: true,
    });

    if (inventory) {
      return inventory;
    } else {
      throw new NotFoundException('Inventory not found');
    }
  }

  async delete(orgId: number, invId: number) {
    const inventory = await this.findByIdOrThrow(invId, {
      relations: {
        items: true,
      },
    });

    if (inventory.items.length !== 0) {
      throw new BadRequestException(
        'You cannot delete an inventory with items in it.',
      );
    }

    await this.inventoryRepository.softDelete(invId);

    return;
  }
}
