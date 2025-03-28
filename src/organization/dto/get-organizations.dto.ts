import { ApiPropertyOptional } from '@nestjs/swagger';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class GetOrganizationsDto extends CursorPaginationDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(50)
  services?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(50)
  radius?: string;
}
