import {
  FindOptionsWhere,
  FindOptionsRelations,
  FindOptionsOrder,
  ObjectLiteral,
} from 'typeorm';

/**
 * Offset pagination options
 * @template T - The type of the entity
 */
export interface OffsetPaginationOptions<T extends ObjectLiteral> {
  where?: FindOptionsWhere<T>;
  relations?: FindOptionsRelations<T>;
  order?: FindOptionsOrder<T>;
}
