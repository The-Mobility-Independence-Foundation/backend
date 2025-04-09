import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetInventoriesDto extends CursorPaginationDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the inventory.' })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the address.' })
  @IsPositive()
  address?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The status of inventories to show' })
  @IsString()
  archived?: string;
}
