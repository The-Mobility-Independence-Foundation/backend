import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Cursor Pagination DTO
 */
export class CursorPaginationDto {
  @ApiProperty({
    description: 'Cursor for pagination (base64 encoded)',
    required: false,
  })
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    description: 'Direction of pagination',
    default: 'next',
    enum: ['next', 'previous'],
    required: false,
  })
  @IsString()
  @IsOptional()
  direction: 'next' | 'previous' = 'next';
}
