import { Injectable, NotFoundException } from '@nestjs/common';
import { Listing } from './listing.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { Organization } from '../organization/organization.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async create() {
    const listing = new Listing();
    const owner = await this.organizationRepository.findOneBy({ id: 1 });
    const inventoryItem = await this.inventoryItemRepository.findOneBy({
      id: 1,
    });

    if (inventoryItem) {
      listing.inventoryItem = inventoryItem;
    }
    if (owner) {
      listing.owner = owner;
    }

    listing.name = 'My listing.';
    listing.description = 'This is my listing.';
    listing.attributes = { size: 100 };
    listing.latitude = 0.0;
    listing.longitude = 0.0;
    listing.zipCode = '12345-6789';

    return this.listingRepository.save(listing);
  }

  async findAll() {
    return this.listingRepository.find();
  }

  async findOne(id: number) {
    return this.listingRepository.findOneBy({ id: id });
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
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const listing = await this.listingRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
    });

    if (listing) {
      return listing;
    } else {
      throw new NotFoundException('Listing does not exist.');
    }
  }
}
