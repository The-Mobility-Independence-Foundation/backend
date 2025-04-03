import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetModelTypesDto extends CursorPaginationDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the model type.' })
  name?: string;
}
