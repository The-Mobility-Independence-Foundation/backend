import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class SearchListingsDto extends CursorPaginationDto {
  @IsString()
  @IsNotEmpty()
  query?: string;

  @IsNumber()
  @IsOptional()
  milesRadius?: number;

  @IsString()
  @IsOptional()
  @Length(5, 10)
  @Transform(({ value }) => value.replace(/[^0-9]/g, ''))
  zipCode?: string;

  @IsNumber()
  @IsOptional()
  organizationId?: number;
}
