import { IsOptional, IsPositive } from 'class-validator';
import { ReportType } from '../report.entity';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class SearchReportsDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The id of the person making the report.',
  })
  @IsPositive()
  reporterId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The id of the person being reported.' })
  @IsPositive()
  reportedUserId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: "The report's type." })
  @IsPositive()
  reportType?: ReportType;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Only get reports from before this date.',
  })
  before?: Date;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Only get reports from after this date.',
  })
  after?: Date;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Only get reports on this date.' })
  on?: Date;
}

export class GetReportsDto extends IntersectionType(
  CursorPaginationDto,
  SearchReportsDto,
) {}
