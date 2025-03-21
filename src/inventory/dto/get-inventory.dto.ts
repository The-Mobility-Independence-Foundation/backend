import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class getInventoryDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the inventory.' })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the organization.' })
  @IsPositive()
  organizationId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the address.' })
  @IsPositive()
  address?: number;
}

export class GetInventoriesDto extends IntersectionType(
  CursorPaginationDto,
  getInventoryDto,
) {}
