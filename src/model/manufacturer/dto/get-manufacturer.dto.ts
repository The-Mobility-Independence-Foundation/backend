import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';

export class SearchManufacturerDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the manufacturer.' })
  name?: string;
}

export class GetManufacturersDto extends IntersectionType(
  CursorPaginationDto,
  SearchManufacturerDto,
) {}
