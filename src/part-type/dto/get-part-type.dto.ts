import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetPartTypesDto extends CursorPaginationDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the part type.' })
  name?: string;
}