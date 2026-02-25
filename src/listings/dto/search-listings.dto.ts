import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SearchListingsDto extends CursorPaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The query to search for',
    example: 'My Listing',
    required: false,
  })
  query?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The miles radius to search for',
    example: 10,
    required: false,
  })
  milesRadius?: number;

  @IsString()
  @IsOptional()
  @Length(5, 10)
  @Transform(({ value }) => value.replace(/[^0-9]/g, ''))
  @ApiProperty({
    description: 'The zip code to search for',
    example: '12345',
    required: false,
  })
  zipCode?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The organization id to search for',
    example: 1,
    required: false,
  })
  organizationId?: number;
}
