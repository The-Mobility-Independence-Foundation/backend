import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from '../report.entity';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ description: 'The id of the user who made the report.' })
  @IsPositive()
  @IsInt()
  reporterId: number;

  @ApiProperty({ description: 'The id of the user who is being reported.' })
  @IsPositive()
  @IsInt()
  reportedUserId: number;

  @IsOptional()
  @ApiProperty({
    description:
      "The id of the post being reported, if ReportType = 'post'. Else, null.",
  })
  @IsPositive()
  @IsInt()
  postId?: number;

  @IsOptional()
  @ApiProperty({
    description:
      "The id of the listing being reported, if ReportType = 'listing'. Else, null.",
  })
  @IsPositive()
  @IsInt()
  listingId?: number;

  @IsOptional()
  @ApiProperty({
    description:
      "The id of the comment being reported, if ReportType = 'comment'. Else, null.",
  })
  @IsPositive()
  @IsInt()
  commentId?: number;

  @ApiProperty({ description: "The user's reason for creating the report." })
  @IsNotEmpty()
  @MaxLength(200)
  reason: string;

  @ApiProperty({
    description: 'An enum that determines what type of report this is.',
    default: ReportType.PROFILE,
  })
  @IsEnum(ReportType)
  reportType: ReportType;
}
