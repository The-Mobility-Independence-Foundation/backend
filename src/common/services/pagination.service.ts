import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { BaseApiPaginationResponse } from '../responses/base-api-pagination.response';
import { PaginationOptions } from '../interfaces/pagination-options.interface';

@Injectable()
export class PaginationService {
  /**
   * Paginate a TypeORM repository
   * @param repository - The repository to paginate
   * @param paginationDto - The pagination dto
   * @param options - The pagination options
   * @template T - The type of the entity
   */
  async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    options: PaginationOptions<T>,
  ): Promise<BaseApiPaginationResponse<T>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await repository.findAndCount({
      skip,
      take: limit,
      ...options,
    });

    return this.createPaginationResponse(items, totalItems, page, limit);
  }

  /**
   * Create a pagination result object
   * @param items - The items to paginate
   * @param totalItems - The total number of items
   * @param page - The current page
   * @param limit - The number of items per page
   * @template T - The type of the entity
   */
  private createPaginationResponse<T extends ObjectLiteral>(
    items: T[],
    totalItems: number,
    page: number,
    limit: number,
  ): BaseApiPaginationResponse<T> {
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
}
