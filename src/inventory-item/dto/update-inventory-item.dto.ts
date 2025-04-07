import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryItemDto } from './create-inventory-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInventoryItemDto extends PartialType(
  CreateInventoryItemDto,
) {
  @ApiProperty({
    description: 'Whether to restore an archived item or not',
    default: 'false',
    enum: ['false', 'true'],
    required: false,
  })
  @IsString()
  @IsOptional()
  restore: 'false' | 'true' = 'false';
}
