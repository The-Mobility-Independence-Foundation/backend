import {
  FindOptionsWhere,
  FindOptionsRelations,
  FindOptionsOrder,
  ObjectLiteral,
} from 'typeorm';

/**
 * Pagination options
 * @template T - The type of the entity
 */
export interface PaginationOptions<T extends ObjectLiteral> {
  where: FindOptionsWhere<T>;
  relations?: FindOptionsRelations<T>;
  order?: FindOptionsOrder<T>;
}
