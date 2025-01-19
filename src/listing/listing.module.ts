import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { Listing } from './listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [ListingController],
  providers: [ListingService]
})
export class ListingModule {}
