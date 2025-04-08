import { ApiProperty } from '@nestjs/swagger';
import { ObjectLiteral } from 'typeorm';

/**
 * Base API cursor pagination response
 * @template T - The type of the items
 */
export class BaseApiCursorPaginationResponse<T extends ObjectLiteral> {
  @ApiProperty({ type: [Object] })
  results: T[];

  @ApiProperty({ type: Boolean })
  hasNextPage: boolean;

  @ApiProperty({ type: Boolean })
  hasPreviousPage: boolean;

  @ApiProperty({ type: String, nullable: true })
  nextCursor: string | null;

  @ApiProperty({ type: String, nullable: true })
  previousCursor: string | null;

  @ApiProperty({ type: Number, required: false })
  count?: number;
}
