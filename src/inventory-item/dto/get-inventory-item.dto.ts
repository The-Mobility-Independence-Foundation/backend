import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetInventoryItemsDto extends CursorPaginationDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the part.' })
  @IsPositive()
  @IsInt()
  partId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the model.' })
  @IsPositive()
  @IsInt()
  modelId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the inventory.' })
  @IsPositive()
  @IsInt()
  inventoryId?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The quantity of the item in inventory.',
  })
  @IsPositive()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The public count of the item.' })
  @IsPositive()
  @IsInt()
  publicCount?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Notes related to the inventory item.' })
  @IsString()
  notes?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the part.' })
  @IsString()
  partName?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Additional attributes of the inventory item.',
  })
  @IsObject()
  attributes?: Record<string, any>;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Tag related to the inventory item.' })
  @IsInt()
  tagId?: number;

  @IsOptional()
  @ApiProperty({
    description: 'The status of inventory items to get',
    default: 'unarchived',
    enum: ['unarchived', 'archived', 'both'],
    required: false,
  })
  @IsString()
  status: string;
}
