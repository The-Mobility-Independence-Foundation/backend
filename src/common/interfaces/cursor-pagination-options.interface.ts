import {
  FindOptionsWhere,
  FindOptionsRelations,
  FindOptionsOrder,
  ObjectLiteral,
} from 'typeorm';

/**
 * Cursor pagination options
 * @template T - The type of the entity
 */
export interface CursorPaginationOptions<T extends ObjectLiteral> {
  cursorColumn: keyof T;
  where?: FindOptionsWhere<T>;
  relations?: FindOptionsRelations<T>;
  order?: FindOptionsOrder<T>;
  includeCount?: boolean;
}
