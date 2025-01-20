import { Injectable } from '@nestjs/common';
import { Listing } from './listing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListingService {

    constructor(
        @InjectRepository(Listing)
        private listingRepository: Repository<Listing>,
    ) {}

    async create() {
        const listing = new Listing();
        listing.inventoryItem = 1;
        listing.owner = 1;
        listing.name = "My listing.";
        listing.description = "This is my listing.";
        listing.attributes = "These are my attributes.";
        listing.latitude = 0.0;
        listing.longitude = 0.0;
        listing.zipcode = "12345-6789";

        return this.listingRepository.save(listing);
    }

    async findAll() {
        
        return this.listingRepository.find();
        
    }

    async findOne(id: number) {

        return this.listingRepository.findOneBy({id: id});

    }

}
