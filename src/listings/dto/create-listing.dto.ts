import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the inventory item',
    example: 1,
  })
  inventoryItemId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the listing',
    example: 'My Listing',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The description of the listing',
    example: 'This is a description of my listing',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The quantity of the listing',
    example: 1,
  })
  quantity: number;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'The attributes of the listing',
    example: {
      color: 'red',
    },
  })
  attributes: object;
}
