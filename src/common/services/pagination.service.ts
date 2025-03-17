import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral, LessThan, MoreThan } from 'typeorm';
import { OffsetPaginationDto } from '../dto/offset-pagination.dto';
import { BaseApiPaginationResponse } from '../responses/base-api-pagination.response';
import { OffsetPaginationOptions } from '../interfaces/offset-pagination-options.interface';
import { BaseApiCursorPaginationResponse } from '../responses/base-api-cursor-pagination.response';
import { CursorPaginationDto } from '../dto/cursor-pagination.dto';
import { CursorPaginationOptions } from '../interfaces/cursor-pagination-options.interface';

@Injectable()
export class PaginationService {
  /**
   * Paginate a TypeORM repository using offset-based pagination
   * @param repository - The repository to paginate
   * @param paginationDto - The pagination dto
   * @param options - The pagination options
   * @template T - The type of the entity
   */
  async paginateWithOffset<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationDto: OffsetPaginationDto,
    options?: OffsetPaginationOptions<T>,
  ): Promise<BaseApiPaginationResponse<T>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await repository.findAndCount({
      skip,
      take: limit,
      ...options,
    });

    const totalPages = Math.ceil(totalItems / limit);
    return {
      totalItems,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      results: items,
    };
  }

  /**
   * Paginate a TypeORM repository using cursor-based pagination
   * @param repository - The repository to paginate
   * @param paginationDto - The cursor pagination dto
   * @param options - The cursor pagination options
   * @template T - The type of the entity
   */
  async paginateWithCursor<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationDto: CursorPaginationDto,
    options: CursorPaginationOptions<T>,
  ): Promise<BaseApiCursorPaginationResponse<T>> {
    const { cursor, limit, direction } = paginationDto;
    const {
      cursorColumn,
      where = {},
      relations = {},
      order = {},
      includeCount = false,
    } = options;
    let whereClause = { ...where };
    const orderClause = {
      ...order,
      [cursorColumn]: direction === 'next' ? 'ASC' : 'DESC',
    };

    const decodedCursor = cursor ? this.decodeCursor(cursor) : undefined;
    if (decodedCursor) {
      whereClause = {
        ...whereClause,
        [cursorColumn]:
          direction === 'next'
            ? MoreThan(decodedCursor)
            : LessThan(decodedCursor),
      };
    }

    const items = await repository.find({
      // Fetch one more item than requested to determine if there are more pages
      take: limit + 1,
      relations,
      where: whereClause,
      order: orderClause,
    });

    const hasNextPage = items.length > limit;
    let hasPreviousPage = false;

    if (direction === 'next') {
      // In "next" direction, previous page exists if we have a cursor
      hasPreviousPage = !!cursor;
    } else {
      // In "previous" direction, we need to check if there are more items in the opposite direction
      if (items.length > 0) {
        // Check if there are any items before the first item in our current set
        const firstItemId = items[0][cursorColumn];
        const previousCheck = await repository.count({
          where: {
            ...where,
            [cursorColumn]: LessThan(firstItemId),
          },
        });

        hasPreviousPage = previousCheck > 0;
      }
    }

    // Remove the extra item that we fetched to determine if there are more pages
    if (hasNextPage) {
      items.pop();
    }

    let count: number | undefined;
    if (includeCount) {
      count = await repository.count({ where });
    }

    const nextCursor =
      hasNextPage && items.length > 0
        ? this.encodeCursor(items[items.length - 1][cursorColumn])
        : null;
    const previousCursor =
      items.length > 0 ? this.encodeCursor(items[0][cursorColumn]) : null;

    return {
      results: items,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor,
      count,
    };
  }

  /**
   * Encode a value to a cursor
   * @param value - The value to encode
   * @returns The encoded cursor
   */
  private encodeCursor(value: any): string {
    return Buffer.from(String(value)).toString('base64');
  }

  /**
   * Decode a cursor to a value
   * @param cursor - The cursor to decode
   * @returns The decoded value
   */
  private decodeCursor(cursor: string): any {
    return Buffer.from(cursor, 'base64').toString('utf-8');
  }
}
