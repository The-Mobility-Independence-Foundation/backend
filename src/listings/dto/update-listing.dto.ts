import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ListingStatus } from '../listing.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsOptional()
  @IsEnum(ListingStatus)
  @ApiProperty({
    description: 'The status of the listing',
    enum: ListingStatus,
    example: ListingStatus.ACTIVE,
  })
  status?: ListingStatus;
}
