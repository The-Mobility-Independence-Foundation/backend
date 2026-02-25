import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Address response
 */
export class AddressResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first line of the address',
    example: '123 Main St',
  })
  addressLine1: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The second line of the address',
    example: 'Apt 1',
  })
  addressLine2: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The city',
    example: 'San Francisco',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The state',
    example: 'CA',
  })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The zip code',
    example: '94101',
  })
  zipCode: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The latitude',
    example: 37.774929,
  })
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The longitude',
    example: -122.419416,
  })
  longitude: number;
}
