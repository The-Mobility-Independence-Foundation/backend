import { AttachmentResponse } from 'src/attachments/responses/attachment.response';
import { ListingStatus } from '../listing.entity';
import { AddressResponse } from 'src/address/responses/address.response';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsObject,
  IsEnum,
  IsDate,
  IsArray,
  IsOptional,
} from 'class-validator';

/**
 * Listing model type response
 */
export class ListingModelTypeResponse {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the model type',
    example: 1,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the model type',
    example: 'Sedan',
  })
  name: string;
}

/**
 * Listing manufacturer response
 */
export class ListingManufacturerResponse {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the manufacturer',
    example: 1,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the manufacturer',
    example: 'Honda',
  })
  name: string;
}

/**
 * Listing model response
 */
export class ListingModelResponse {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the model',
    example: 1,
  })
  id: number;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The manufacturer details of the model',
    type: ListingManufacturerResponse,
  })
  manufacturer: ListingManufacturerResponse;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the model',
    example: 'Civic',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The year of the model',
    example: 2020,
  })
  year: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The types of the model',
    type: [ListingModelTypeResponse],
  })
  types: ListingModelTypeResponse[];
}

/**
 * Listing part type response
 */
export class ListingPartTypeResponse {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the part type',
    example: 1,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the part type',
    example: 'Brake System',
  })
  name: string;
}

/**
 * Listing part response
 */
export class ListingPartResponse {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the part',
    example: 1,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the part',
    example: 'Brake Pad',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the part',
    example: 'Front brake pad set',
  })
  description: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The model details of the part',
    type: ListingModelResponse,
  })
  model: ListingModelResponse;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The part number',
    example: 'BP-1234',
    required: false,
  })
  partNumber?: string | null;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The types of the part',
    type: [ListingPartTypeResponse],
  })
  types: ListingPartTypeResponse[];
}

/**
 * Listing response
 */
export class ListingResponse {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the listing',
    example: 1,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the listing',
    example: 'Listing 1',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the listing',
    example: 'This is a detailed description of the listing',
  })
  description: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Additional attributes of the listing',
    example: { condition: 'new', color: 'red' },
  })
  attributes: object;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The quantity of items available',
    example: 1,
  })
  quantity: number;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The address of the listing',
    type: AddressResponse,
  })
  address: AddressResponse;

  @IsEnum(ListingStatus)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The status of the listing',
    enum: ListingStatus,
    example: ListingStatus.ACTIVE,
  })
  status: ListingStatus;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The creation date of the listing',
    example: '2024-03-20T12:00:00Z',
  })
  createdAt: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the organization that owns the listing',
    example: 1,
  })
  organizationId: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Attachments associated with the listing',
    type: [AttachmentResponse],
  })
  attachments: AttachmentResponse[];

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The part details of the listing',
    type: ListingPartResponse,
  })
  part: ListingPartResponse;
}
