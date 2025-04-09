import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Part cannot be blank' })
  partId: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Model cannot be blank.' })
  modelId: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNotEmpty({ message: 'Quantity cannot be blank.' })
  quantity: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsOptional()
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
