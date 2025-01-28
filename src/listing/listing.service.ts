import { Injectable } from '@nestjs/common';
import { Listing } from './listing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { InventoryItem } from '../inventory/inventory-item/inventory-item.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async create() {
    const listing = new Listing();
    const owner = await this.userRepository.findOneBy({ id: 1 });
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
    listing.attributes = 'These are my attributes.';
    listing.latitude = 0.0;
    listing.longitude = 0.0;
    listing.zipcode = '12345-6789';

    return this.listingRepository.save(listing);
  }

  async findAll() {
    return this.listingRepository.find();
  }

  async findOne(id: number) {
    return this.listingRepository.findOneBy({ id: id });
  }
}
