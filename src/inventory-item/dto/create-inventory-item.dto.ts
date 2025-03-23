import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Part cannot be blank' })
  part: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Model cannot be blank.' })
  model: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Inventory cannot be blank.' })
  inventory: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Quantity cannot be blank.' })
  quantity: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Public count cannot be blank.' })
  publicCount: number;

  @ApiProperty()
  @MaxLength(500, {
    message: 'Notes is too long. Maximum length is $constraint1 characters.',
  })
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsObject()
  attributes?: Record<string, any>;
}
