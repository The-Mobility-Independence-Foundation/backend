import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsPositive, MaxLength } from 'class-validator';

export class UpdateInventoryItemDto {
  @ApiProperty()
  @IsPositive()
  inventory?: number;

  @ApiProperty()
  @IsPositive()
  quantity?: number;

  @ApiProperty()
  @IsPositive()
  publicCount?: number;

  @ApiProperty()
  @MaxLength(500, {
    message: 'Notes are too long. Maximum length is $constraint1 characters.',
  })
  notes?: string;

  @ApiProperty()
  @IsObject()
  attributes?: Record<string, any>;
}
