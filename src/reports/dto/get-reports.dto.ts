import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ReportType } from '../report.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetReportsDto extends CursorPaginationDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The id of the nest report to get.' })
  @IsPositive()
  nextToken?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The number of reports to get.' })
  @IsPositive()
  count?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The id of the person making the report.',
  })
  @IsPositive()
  @IsInt()
  reporterId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The id of the person being reported.' })
  @IsPositive()
  @IsInt()
  reportedUserId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: "The report's type." })
  @IsPositive()
  @IsEnum(ReportType)
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
