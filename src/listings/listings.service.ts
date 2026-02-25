import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Listing } from './listing.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListingDto } from './dto/create-listing.dto';
import { User } from '../user/entities/user.entity';
import { InventoryItemService } from '../inventory-item/inventory-item.service';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingStatus } from './listing.entity';
import { PaginationService } from '../common/services/pagination.service';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { SearchListingsDto } from './dto/search-listings.dto';
import { AddressService } from '../address/address.service';
import { ListingResponse } from './responses/listing.response';
import { AttachmentsService } from '../attachments/attachments.service';
import { AttachmentEntityType } from '../attachments/attachment.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly inventoryItemService: InventoryItemService,
    private paginationService: PaginationService,
    private addressService: AddressService,
    private attachmentsService: AttachmentsService,
  ) {}

  /**
   * Search listings using Full Text Search with cursor-based pagination
   * If the user is not part of the organization, they can only see active listings
   * Otherwise, they can see all listings including deleted ones
   * @param user - The user searching for listings
   * @param paginationDto - The cursor pagination dto
   * @returns The paginated search results
   */
  async findAll(
    user: User,
    paginationDto: SearchListingsDto,
  ): Promise<BaseApiCursorPaginationResponse<ListingResponse>> {
    const { milesRadius, zipCode, query, organizationId } = paginationDto;
    const queryBuilder = this.listingRepository.createQueryBuilder('listing');

    if (milesRadius) {
      if (!zipCode) {
        throw new BadRequestException(
          'Must provide zipcode when radius is provided.',
        );
      }

      const [address] = await this.addressService.geocode(zipCode);
      const { latitude, longitude } = address;

      const radiusInMeters = milesRadius * 1609.34;
      queryBuilder.andWhere(
        'ST_DWithin(listing.point, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :radius)',
        {
          longitude,
          latitude,
          radius: radiusInMeters,
        },
      );
    }

    if (organizationId) {
      queryBuilder.andWhere('listing.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (organizationId !== user.organizationId) {
      queryBuilder.andWhere('listing.status = :status', {
        status: ListingStatus.ACTIVE,
      });
    }

    if (query) {
      queryBuilder
        .andWhere(`to_tsquery('english', :query) @@ listing.ftsVector`, {
          query: query.replace(/\s+/g, ' & '),
        })
        .orderBy(
          `ts_rank(listing.ftsVector, to_tsquery('english', :query))`,
          'DESC',
        );
    }

    // queryBuilder
    //   .leftJoinAndSelect('listing.inventoryItem', 'inventoryItem')
    //   .leftJoinAndSelect('inventoryItem.inventory', 'inventory')
    //   .leftJoinAndSelect('listing.organization', 'organization');

    const withDeleted = organizationId === user.organizationId;
    const result = await this.paginationService.paginateWithCursorQueryBuilder(
      queryBuilder,
      paginationDto,
      {
        cursorColumn: 'id',
        includeCount: true,
        withDeleted,
      },
    );

    const listings = await Promise.all(
      result.results.map((listing) => this.buildListingResponse(listing.id)),
    );

    return {
      ...result,
      results: listings,
    };
  }

  /**
   * Find a listing by id
   * @param id - The id of the listing
   * @param options - Optional query options
   * @returns The listing record
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Listing, 'id'>>;
      relations: FindOptionsRelations<Listing>;
      withDeleted: boolean;
    }> = {},
  ) {
    const { where = {}, relations, withDeleted } = options;

    const listing = await this.listingRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
      withDeleted,
    });

    if (!listing) {
      throw new NotFoundException('Listing does not exist.');
    }

    return listing;
  }

  /**
   * Create a listing
   * @param user - The user creating the listing
   * @param dto - The listing data
   * @param attachments - The files to attach to the listing
   * @returns The created listing
   */
  async create(
    user: User,
    createListingDto: CreateListingDto,
    attachments?: Express.Multer.File[],
  ): Promise<ListingResponse> {
    const inventoryItem = await this.inventoryItemService.findByIdOrThrow(
      createListingDto.inventoryItemId,
      { relations: { inventory: { address: true } } },
    );

    if (inventoryItem.inventory.organizationId !== user.organizationId) {
      throw new ForbiddenException(
        'You are not allowed to create a listing for this inventory item.',
      );
    }

    if (inventoryItem.quantity <= inventoryItem.publicCount) {
      throw new BadRequestException(
        'You are not allowed to create a listing for more than the inventory item quantity.',
      );
    }

    let listing: Listing | undefined;
    try {
      listing = await this.listingRepository.save({
        inventoryItemId: inventoryItem.id,
        organizationId: user.organizationId,
        name: createListingDto.name,
        description: createListingDto.description,
        attributes: createListingDto.attributes || {},
        quantity: createListingDto.quantity,
        point: {
          type: 'Point',
          coordinates: [
            inventoryItem.inventory.address.longitude,
            inventoryItem.inventory.address.latitude,
          ],
        },
      });

      if (attachments && attachments.length > 0) {
        await this.attachmentsService.uploadFiles(
          listing.id,
          AttachmentEntityType.LISTING,
          attachments,
          user.id,
        );
      }

      return this.buildListingResponse(listing.id);
    } catch (error) {
      if (listing) {
        await this.listingRepository.delete(listing.id);
      }

      throw new BadRequestException('Failed to create listing.', {
        cause: error,
      });
    }
  }

  /**
   * Update a listing
   * @param user - The user updating the listing
   * @param listingId - The id of the listing
   * @param updateListingDto - The listing data
   * @returns The updated listing
   */
  async update(
    user: User,
    listingId: number,
    updateListingDto: UpdateListingDto,
  ): Promise<ListingResponse> {
    if (updateListingDto.inventoryItemId) {
      throw new BadRequestException(
        'You are not allowed to update the inventory item for this listing.',
      );
    }

    const listing = await this.findByIdOrThrow(listingId, {
      relations: {
        inventoryItem: true,
      },
    });

    if (listing.organizationId !== user.organizationId) {
      throw new ForbiddenException(
        'You are not allowed to update this listing.',
      );
    }

    if (listing.status === ListingStatus.COMPLETE) {
      throw new BadRequestException(
        'You are not allowed to update a complete listing.',
      );
    }

    if (listing.status === ListingStatus.ARCHIVED) {
      throw new BadRequestException(
        'You are not allowed to update an archived listing.',
      );
    }

    // We update this when they mark an order as complete
    if (updateListingDto.status === ListingStatus.COMPLETE) {
      throw new BadRequestException(
        'You are not allowed to update a listing to complete.',
      );
    }

    if (updateListingDto.quantity) {
      if (updateListingDto.quantity <= listing.inventoryItem.publicCount) {
        throw new BadRequestException(
          'You are not allowed to update the listing quantity to more than the inventory item quantity.',
        );
      }
    }

    await this.listingRepository.update(listingId, {
      name: updateListingDto.name,
      description: updateListingDto.description,
      quantity: updateListingDto.quantity,
      attributes: updateListingDto.attributes,
      status: updateListingDto.status,
    });

    return this.buildListingResponse(listingId);
  }

  /**
   * Delete a listing by archiving it
   * @param user - The user deleting the listing
   * @param listingId - The id of the listing
   * @returns The deleted listing
   */
  async delete(user: User, listingId: number): Promise<void> {
    const listing = await this.findByIdOrThrow(listingId);

    if (listing.organizationId !== user.organizationId) {
      throw new ForbiddenException(
        'You are not allowed to delete this listing.',
      );
    }

    await this.listingRepository.update(listingId, {
      status: ListingStatus.ARCHIVED,
    });

    await this.listingRepository.softDelete(listingId);
  }

  /**
   * Build a listing response
   * @param listingId - The id of the listing
   * @returns The listing response
   */
  private async buildListingResponse(
    listingId: number,
  ): Promise<ListingResponse> {
    const listing = await this.findByIdOrThrow(listingId, {
      withDeleted: true,
      relations: {
        inventoryItem: {
          inventory: {
            address: true,
          },
          part: {
            model: {
              manufacturer: true,
              types: true,
            },
            types: true,
          },
        },
        organization: true,
      },
    });

    const attachments = await this.attachmentsService.findByEntity(
      listingId,
      AttachmentEntityType.LISTING,
    );

    return {
      ...listing,
      address: listing.inventoryItem.inventory.address,
      attachments:
        await this.attachmentsService.formulateAttachmentResponse(attachments),
      part: listing.inventoryItem.part,
    };
  }
}
