import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetModelsDto extends CursorPaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ description: 'Manufacturer ID' })
  manufacturerId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the model.' })
  name?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ description: 'Year of the model' })
  year?: number;

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ApiPropertyOptional({
    type: [Number],
    description: 'Filter by multiple Model Type IDs',
  })
  modelTypeIds?: number[];
}
