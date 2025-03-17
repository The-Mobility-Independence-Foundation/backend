import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsPositive, MaxLength } from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty({ message: 'Part cannot be blank' })
  part: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty({ message: 'Model cannot be blank.' })
  model: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty({ message: 'Inventory cannot be blank.' })
  inventory: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty({ message: 'Quantity cannot be blank.' })
  quantity: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty({ message: 'Public count cannot be blank.' })
  publicCount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Notes cannot be blank.' })
  @MaxLength(500, {
    message: 'Notes is too long. Maximum length is $constraint1 characters.',
  })
  notes: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Attributes cannot be blank.' })
  @IsObject()
  attributes: Record<string, any>;
}
