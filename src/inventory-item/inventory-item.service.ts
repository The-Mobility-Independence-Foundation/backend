import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { PartService } from '../part/part.service';
import { ModelService } from '../model/model.service';
import { PaginationService } from '../common/services/pagination.service';
import { InventoryService } from '../inventory/inventory.service';
import { GetInventoryItemsDto } from './dto/get-inventory-item.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { CursorPaginationOptions } from '../common/interfaces/cursor-pagination-options.interface';

@Injectable()
export class InventoryItemService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    private readonly paginationService: PaginationService,
    private readonly partService: PartService,
    private readonly modelService: ModelService,
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * Create a new instance of an item
   * @param dto : All necessary information to create a new item
   * @returns : The new item being saved into the database
   */
  async create(inventoryId: number, dto: CreateInventoryItemDto) {
    const inventoryItem = new InventoryItem();

    inventoryItem.model = await this.modelService.findByIdOrThrow(dto.modelId, {
      relations: ['manufacturer', 'types'],
    });

    inventoryItem.part = await this.partService.findByIdOrThrow(dto.partId, {
      relations: ['model', 'types'],
    });

    inventoryItem.inventory = await this.inventoryService.findByIdOrThrow(
      inventoryId,
      {
        relations: ['organization', 'address', 'items'],
      },
    );

    inventoryItem.notes = dto.notes;
    inventoryItem.attributes = dto.attributes;
    inventoryItem.quantity = dto.quantity;
    inventoryItem.publicCount = dto.publicCount;

    return this.inventoryItemRepository.save(inventoryItem);
  }

  /**
   * Get a list of all the items being stored in a specific inventory
   * @param organizationId : Organization that owns the inventory
   * @param inventoryId : The iventory where the items are being held
   * @returns : A list of items stored in the inventory
   */
  async findAll(
    organizationId: number,
    inventoryId: number,
    query: GetInventoryItemsDto,
  ) {
    const findWhere: any = {
      inventory: {
        id: inventoryId,
        organization: { id: organizationId },
      },
    };

    if (query.partId) {
      findWhere.part = query.partId;
    }
    if (query.modelId) {
      findWhere.model = query.modelId;
    }
    if (query.tagId) {
      findWhere.tags = { some: { id: query.tagId } };
    }
    if (query.partName) {
      findWhere.part = {
        name: query.partName,
      };
    }

    const paginationDto = new CursorPaginationDto();
    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    const relations: FindOptionsRelations<InventoryItem> = {
      inventory: {
        organization: true,
        address: true,
      },
      part: {},
      model: {},
      listings: true,
      tags: true,
    };

    if (query.status === 'archived') {
      Object.assign(findWhere, {
        archivedAt: Not(IsNull()),
      });
    }

    const findOptions: CursorPaginationOptions<InventoryItem> = {
      cursorColumn: 'id',
      where: findWhere,
      relations: relations,
    };

    if (query.status === 'both' || query.status === 'archived') {
      findOptions.withDeleted = true;
    }

    return this.paginationService.paginateWithCursor(
      this.inventoryItemRepository,
      paginationDto,
      findOptions,
    );
  }

  /**
   * Find a specific item in an inventory
   * @param organizationId : The organization that owns the inventory
   * @param inventoryId : The inventory where the item is stored
   * @param itemId : The item being looked for
   * @returns : All date of the specific item
   */
  async findWithOrgInv(
    organizationId: number,
    inventoryId: number,
    itemId: number,
  ) {
    const item = await this.inventoryItemRepository.findOne({
      where: {
        id: itemId,
        inventory: {
          id: inventoryId,
          organization: { id: organizationId },
        },
      },
      relations: [
        'inventory',
        'inventory.organization',
        'inventory.address',
        'part',
        'model',
        'listings',
      ],
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return item;
  }

  /**
   * Update a specific inventory item with the given data
   * @param organizationId : The organization who knows the inventory where the item is
   * @param inventoryId : The inventory where the item is stored
   * @param id : The ID of the specific item
   * @param dto : All the information to be changed
   * @returns : The updated item being saved in the repository
   */
  async update(
    organizationId: number,
    inventoryId: number,
    id: number,
    dto: UpdateInventoryItemDto,
  ) {
    if (dto.restore === 'true') {
      return this.inventoryItemRepository.restore(id);
    }

    const item = await this.findByIdOrThrow(id, {
      where: {
        inventory: {
          id: inventoryId,
          organization: { id: organizationId },
        },
      },
      relations: [
        'inventory',
        'inventory.organization',
        'inventory.address',
        'part',
        'model',
        'listings',
        'tags',
      ],
    });

    Object.assign(item, {
      ...(dto.attributes && { attributes: dto.attributes }),
      ...(dto.notes && { notes: dto.notes }),
      ...(dto.publicCount && { publicCount: dto.publicCount }),
      ...(dto.quantity && { quantity: dto.quantity }),
    });

    if (dto.modelId) {
      item.model = await this.modelService.findByIdOrThrow(dto.modelId, {
        relations: ['manufacturer', 'types'],
      });
    }

    if (dto.partId) {
      item.part = await this.partService.findByIdOrThrow(dto.partId, {
        relations: ['model', 'types'],
      });
    }

    if (inventoryId) {
      item.inventory = await this.inventoryService.findByIdOrThrow(
        inventoryId,
        {
          relations: ['organization', 'address', 'items'],
        },
      );
    }

    return await this.inventoryItemRepository.save(item);
  }

  /**
   * Finds a specific inventory item based on the ID given
   * @param id : The ID of the specific inventory item given
   * @param options : Any specific options needed to search
   * @returns : The inventory item and any information
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<InventoryItem, 'id'>>;
      relations: string[] | FindOptionsRelations<InventoryItem>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const item = await this.inventoryItemRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (item) {
      return item;
    } else {
      throw new NotFoundException('Item not found');
    }
  }

  async archive(itemId: number) {
    await this.inventoryItemRepository.softDelete(itemId);

    return;
  }
}
