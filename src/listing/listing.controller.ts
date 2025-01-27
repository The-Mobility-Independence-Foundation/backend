import { Controller, Post, Get, Param } from '@nestjs/common';
import { Listing } from './listing.entity';
import { ListingService } from './listing.service';

@Controller('listing')
export class ListingController {

    constructor(private readonly listingService: ListingService) {}
    
    @Post()
    create(): Promise<Listing> {
        return this.listingService.create();
    }

    @Get()
    findAll(): Promise<Listing[]> {
        return this.listingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Listing | null> {
        return this.listingService.findOne(id);
    }

}
