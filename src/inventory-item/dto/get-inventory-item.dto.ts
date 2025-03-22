import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class SearchInventoryItemDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the part.' })
  @IsPositive()
  @IsInt()
  part?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the model.' })
  @IsPositive()
  @IsInt()
  model?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the inventory.' })
  @IsPositive()
  @IsInt()
  inventory?: number;

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
  @ApiPropertyOptional({
    description: 'Additional attributes of the inventory item.',
  })
  @IsObject()
  attributes?: Record<string, any>;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Tags related to the inventory item.' })
  @IsInt({ each: true })
  tag?: number[];
}

export class GetInventoryItemsDto extends IntersectionType(
  CursorPaginationDto,
  SearchInventoryItemDto,
) {}
