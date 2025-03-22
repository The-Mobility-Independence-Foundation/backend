import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsObject, IsOptional, IsPositive } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class getInventoryItemDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the part.' })
  @IsPositive()
  part?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the model.' })
  @IsPositive()
  model?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the inventory.' })
  @IsPositive()
  inventory?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The quantity of the item in inventory.' })
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The public count of the item.' })
  @IsPositive()
  publicCount?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Notes related to the inventory item.' })
  notes?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Additional attributes of the inventory item.' })
  @IsObject()
  attributes?: Record<string, any>;
}

export class GetInventoryItemsDto extends IntersectionType(
    CursorPaginationDto,
    getInventoryItemDto,
  ) {}