import { ApiProperty } from '@nestjs/swagger';
import { ObjectLiteral } from 'typeorm';

/**
 * Base API pagination response
 * @template T - The type of the items
 */
export class BaseApiPaginationResponse<T extends ObjectLiteral> {
  @ApiProperty({ type: Number })
  totalItems: number;

  @ApiProperty({ type: Number })
  itemsPerPage: number;

  @ApiProperty({ type: Number })
  currentPage: number;

  @ApiProperty({ type: Number })
  totalPages: number;

  @ApiProperty({ type: Boolean })
  hasNextPage: boolean;

  @ApiProperty({ type: Boolean })
  hasPreviousPage: boolean;

  @ApiProperty({ type: [Object] })
  results: T[];
}
