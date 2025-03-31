import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from '../services/pagination.service';
import {
  Repository,
  ObjectLiteral,
  LessThan,
  MoreThan,
  FindOptionsWhere,
} from 'typeorm';
import { OffsetPaginationDto } from '../dto/offset-pagination.dto';
import { OffsetPaginationOptions } from '../interfaces/offset-pagination-options.interface';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { CursorPaginationDto } from '../dto/cursor-pagination.dto';
import { CursorPaginationOptions } from '../interfaces/cursor-pagination-options.interface';

describe('PaginationService', () => {
  let service: PaginationService;
  let repository: Repository<ObjectLiteral>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginationService,
        {
          provide: Repository,
          useValue: createMock<Repository<ObjectLiteral>>(),
        },
      ],
    }).compile();

    service = module.get(PaginationService);
    repository = module.get(Repository);
  });

  describe('paginateWithOffset', () => {
    it('should paginate results with default options', async () => {
      const paginationDto = new OffsetPaginationDto();
      Object.assign(paginationDto, { page: 1, limit: 10 });

      const items = [{ id: 1 }, { id: 2 }];
      const totalItems = items.length;

      when(repository.findAndCount)
        .calledWith({
          skip: 0,
          take: 10,
        })
        .mockResolvedValue([items, totalItems]);

      const result = await service.paginateWithOffset(
        repository,
        paginationDto,
      );

      expect(result).toBeDefined();
      expect(result.totalItems).toBe(totalItems);
      expect(result.itemsPerPage).toBe(paginationDto.limit);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(paginationDto.page);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.results).toEqual(items);
    });

    it('should paginate results with custom options', async () => {
      const paginationDto = new OffsetPaginationDto();
      Object.assign(paginationDto, { page: 2, limit: 5 });

      const items = [{ id: 6 }, { id: 7 }, { id: 8 }];
      const totalItems = 8;

      const options: OffsetPaginationOptions<ObjectLiteral> = {
        where: { active: true },
        order: { id: 'desc' },
      };

      when(repository.findAndCount)
        .calledWith({
          skip: 5,
          take: 5,
          ...options,
        })
        .mockResolvedValue([items, totalItems]);

      const result = await service.paginateWithOffset(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.totalItems).toBe(totalItems);
      expect(result.itemsPerPage).toBe(paginationDto.limit);
      expect(result.totalPages).toBe(2);
      expect(result.currentPage).toBe(paginationDto.page);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.results).toEqual(items);
    });

    it('should handle empty results', async () => {
      const paginationDto = new OffsetPaginationDto();
      paginationDto.page = 1;
      paginationDto.limit = 10;

      when(repository.findAndCount)
        .calledWith({
          skip: 0,
          take: 10,
        })
        .mockResolvedValue([[], 0]);

      const result = await service.paginateWithOffset(
        repository,
        paginationDto,
        {},
      );

      expect(result).toBeDefined();
      expect(result.totalItems).toBe(0);
      expect(result.itemsPerPage).toBe(paginationDto.limit);
      expect(result.totalPages).toBe(0);
      expect(result.currentPage).toBe(paginationDto.page);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.results).toEqual([]);
    });

    it('should handle last page with partial results', async () => {
      const paginationDto = new OffsetPaginationDto();
      paginationDto.page = 3;
      paginationDto.limit = 5;

      const items = [{ id: 11 }, { id: 12 }];
      const totalItems = 12;

      when(repository.findAndCount)
        .calledWith({
          skip: 10,
          take: 5,
        })
        .mockResolvedValue([items, totalItems]);

      const result = await service.paginateWithOffset(
        repository,
        paginationDto,
        {},
      );

      expect(result).toBeDefined();
      expect(result.totalItems).toBe(totalItems);
      expect(result.itemsPerPage).toBe(paginationDto.limit);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(paginationDto.page);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.results).toEqual(items);
    });

    it('should handle middle page with full results', async () => {
      const paginationDto = new OffsetPaginationDto();
      paginationDto.page = 2;
      paginationDto.limit = 5;

      const items = [{ id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }];
      const totalItems = 15;

      when(repository.findAndCount)
        .calledWith({
          skip: 5,
          take: 5,
        })
        .mockResolvedValue([items, totalItems]);

      const result = await service.paginateWithOffset(
        repository,
        paginationDto,
        {},
      );

      expect(result).toBeDefined();
      expect(result.totalItems).toBe(totalItems);
      expect(result.itemsPerPage).toBe(paginationDto.limit);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(paginationDto.page);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.results).toEqual(items);
    });
  });

  describe('paginateWithCursor', () => {
    it('should paginate with cursor in next direction', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: Buffer.from('5').toString('base64'),
        limit: 3,
        direction: 'next',
      });

      const items = [{ id: 6 }, { id: 7 }, { id: 8 }];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: { active: true },
        order: { createdAt: 'DESC' },
        includeCount: true,
      };

      when(repository.find)
        .calledWith({
          take: paginationDto.limit + 1,
          where: [{ active: true, id: MoreThan('5') }],
          order: { createdAt: 'DESC', id: 'ASC' },
          relations: {},
          withDeleted: false,
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({ where: options.where })
        .mockResolvedValue(8);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.hasNextPage).toBe(false);
      expect(result.count).toBe(8);
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).not.toBeNull();
      expect(result.previousCursor).toBe(Buffer.from('6').toString('base64'));
    });

    it('should paginate with cursor in previous direction', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: Buffer.from('5').toString('base64'),
        limit: 3,
        direction: 'previous',
      });

      const items = [{ id: 2 }, { id: 3 }, { id: 4 }];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: { active: true },
      };

      when(repository.find)
        .calledWith({
          where: [{ active: true, id: LessThan('5') }],
          order: { id: 'DESC' },
          take: paginationDto.limit + 1,
          relations: {},
          withDeleted: false,
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({
          where: [{ active: true, id: LessThan(2) }],
        })
        .mockResolvedValue(1);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).not.toBeNull();
      expect(result.previousCursor).toBe(Buffer.from('2').toString('base64'));
    });

    it('should paginate without cursor (first page)', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        limit: 3,
        direction: 'next',
      });

      const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        includeCount: true,
      };

      when(repository.find)
        .calledWith({
          take: paginationDto.limit + 1,
          order: { id: 'ASC' },
          relations: {},
          where: [{}],
          withDeleted: false,
        })
        .mockResolvedValue(items);

      when(repository.count).calledWith({ where: {} }).mockResolvedValue(10);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toHaveLength(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.count).toBe(10);
      expect(result.nextCursor).not.toBeNull();
      expect(result.nextCursor).toBe(Buffer.from('3').toString('base64'));
      expect(result.previousCursor).toBeNull();
    });

    it('should handle empty results', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        limit: 10,
        direction: 'next',
      });

      const items: ObjectLiteral[] = [];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        includeCount: true,
      };

      when(repository.find)
        .calledWith(expect.anything())
        .mockResolvedValue(items);

      when(repository.count).calledWith({ where: {} }).mockResolvedValue(0);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual([]);
      expect(result.hasNextPage).toBe(false);
      expect(result.count).toBe(0);
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).toBeNull();
    });

    it('should handle relations in options', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        limit: 3,
        direction: 'next',
      });

      const items = [
        { id: 1, user: { name: 'John' } },
        { id: 2, user: { name: 'Jane' } },
        { id: 3, user: { name: 'Bob' } },
      ];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        relations: { user: true },
      };

      when(repository.find)
        .calledWith({
          relations: { user: true },
          where: [{}],
          order: { id: 'ASC' },
          take: paginationDto.limit + 1,
          withDeleted: false,
        })
        .mockResolvedValue(items);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.results[0].user).toBeDefined();
    });

    it('should handle where clause as an array', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: Buffer.from('5').toString('base64'),
        limit: 3,
        direction: 'next',
      });

      const items = [{ id: 6 }, { id: 7 }, { id: 8 }];
      const whereArray: FindOptionsWhere<ObjectLiteral>[] = [
        { active: true, category: 'A' },
        { active: true, category: 'B' },
      ];

      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: whereArray,
        includeCount: true,
      };

      when(repository.find)
        .calledWith({
          where: [
            { active: true, category: 'A', id: MoreThan('5') },
            { active: true, category: 'B', id: MoreThan('5') },
          ],
          order: { id: 'ASC' },
          take: paginationDto.limit + 1,
          relations: {},
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({ where: whereArray })
        .mockResolvedValue(10);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.hasNextPage).toBe(false);
      expect(result.count).toBe(10);
    });

    it('should handle previous pagination properly with where array', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: Buffer.from('5').toString('base64'),
        limit: 3,
        direction: 'previous',
      });

      const items = [{ id: 2 }, { id: 3 }, { id: 4 }];
      const whereArray: FindOptionsWhere<ObjectLiteral>[] = [
        { active: true, category: 'A' },
        { active: true, category: 'B' },
      ];

      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: whereArray,
      };

      when(repository.find)
        .calledWith({
          where: [
            { active: true, category: 'A', id: LessThan('5') },
            { active: true, category: 'B', id: LessThan('5') },
          ],
          order: { id: 'DESC' },
          take: paginationDto.limit + 1,
          relations: {},
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({
          where: [
            { active: true, category: 'A', id: LessThan(2) },
            { active: true, category: 'B', id: LessThan(2) },
          ],
        })
        .mockResolvedValue(1);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.previousCursor).not.toBeNull();
      expect(result.previousCursor).toBe(Buffer.from('2').toString('base64'));
    });

    it('should handle empty results with next direction', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: Buffer.from('5').toString('base64'),
        limit: 10,
        direction: 'next',
      });

      const items: ObjectLiteral[] = [];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: { active: true },
      };

      when(repository.find)
        .calledWith({
          where: [{ active: true, id: MoreThan('5') }],
          order: { id: 'ASC' },
          take: 11,
          relations: {},
        })
        .mockResolvedValue(items);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual([]);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).toBeNull();
    });

    it('should handle empty results with previous direction', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: Buffer.from('5').toString('base64'),
        limit: 10,
        direction: 'previous',
      });

      const items: ObjectLiteral[] = [];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: { active: true },
      };

      when(repository.find)
        .calledWith({
          where: [{ active: true, id: LessThan('5') }],
          order: { id: 'DESC' },
          take: 11,
          relations: {},
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({
          where: [{ active: true, id: LessThan('5') }],
        })
        .mockResolvedValue(0);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual([]);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).toBeNull();
    });

    it('should handle where as array with exactly limit items', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        limit: 3,
        direction: 'next',
      });

      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const whereArray: FindOptionsWhere<ObjectLiteral>[] = [
        { category: 'A' },
        { category: 'B' },
      ];

      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: whereArray,
      };

      when(repository.find)
        .calledWith({
          where: whereArray,
          order: { id: 'ASC' },
          take: 4,
          relations: {},
        })
        .mockResolvedValue(items);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).toBeNull();
    });

    it('should handle where as array with limit+1 items to check hasNextPage', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        limit: 3,
        direction: 'next',
      });

      const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const whereArray: FindOptionsWhere<ObjectLiteral>[] = [
        { category: 'A' },
        { category: 'B' },
      ];

      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: whereArray,
      };

      when(repository.find)
        .calledWith({
          where: whereArray,
          order: { id: 'ASC' },
          take: 4,
          relations: {},
        })
        .mockResolvedValue(items);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toHaveLength(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.nextCursor).not.toBeNull();
      expect(result.previousCursor).toBeNull();
    });

    it('should correctly paginate with cursor in next direction with array where', async () => {
      const firstPaginationDto = new CursorPaginationDto();
      Object.assign(firstPaginationDto, {
        limit: 2,
        direction: 'next',
      });

      const firstPageItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const whereArray: FindOptionsWhere<ObjectLiteral>[] = [
        { category: 'A' },
        { category: 'B' },
      ];

      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: whereArray,
      };

      when(repository.find)
        .calledWith({
          where: whereArray,
          order: { id: 'ASC' },
          take: 3,
          relations: {},
        })
        .mockResolvedValueOnce(firstPageItems);

      const firstResult = await service.paginateWithCursor(
        repository,
        firstPaginationDto,
        options,
      );

      expect(firstResult).toBeDefined();
      expect(firstResult.results).toHaveLength(2);
      expect(firstResult.hasNextPage).toBe(true);
      expect(firstResult.hasPreviousPage).toBe(false);
      expect(firstResult.nextCursor).not.toBeNull();
      expect(firstResult.nextCursor).toBe(Buffer.from('2').toString('base64'));

      const secondPaginationDto = new CursorPaginationDto();
      Object.assign(secondPaginationDto, {
        cursor: firstResult.nextCursor,
        limit: 2,
        direction: 'next',
      });

      const secondPageItems = [{ id: 3 }, { id: 4 }];

      when(repository.find)
        .calledWith({
          take: 3,
          where: [
            { category: 'A', id: MoreThan('2') },
            { category: 'B', id: MoreThan('2') },
          ],
          order: { id: 'ASC' },
          relations: {},
        })
        .mockResolvedValueOnce(secondPageItems);

      const secondResult = await service.paginateWithCursor(
        repository,
        secondPaginationDto,
        options,
      );

      expect(secondResult).toBeDefined();
      expect(secondResult.results).toEqual(secondPageItems);
      expect(secondResult.hasNextPage).toBe(false);
      expect(secondResult.hasPreviousPage).toBe(true);
      expect(secondResult.nextCursor).toBeNull();
      expect(secondResult.previousCursor).not.toBeNull();
    });

    it('should correctly paginate with cursor in previous direction after paginating next', async () => {
      const cursorValue = Buffer.from('3').toString('base64');

      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: cursorValue,
        limit: 2,
        direction: 'previous',
      });

      const items = [{ id: 1 }, { id: 2 }];
      const whereArray: FindOptionsWhere<ObjectLiteral>[] = [
        { category: 'A' },
        { category: 'B' },
      ];

      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
        where: whereArray,
      };

      when(repository.find)
        .calledWith({
          where: [
            { category: 'A', id: LessThan('3') },
            { category: 'B', id: LessThan('3') },
          ],
          order: {
            id: 'DESC',
          },
          take: 3,
          relations: {},
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({
          where: [
            { category: 'A', id: LessThan('1') },
            { category: 'B', id: LessThan('1') },
          ],
        })
        .mockResolvedValue(0);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).toBeNull();
    });
  });

  describe('encodeCursor and decodeCursor', () => {
    it('should correctly encode and decode cursor values', async () => {
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: Buffer.from('5').toString('base64'),
        limit: 1,
        direction: 'next',
      });

      const items = [{ id: 6 }];
      const options: CursorPaginationOptions<ObjectLiteral> = {
        cursorColumn: 'id',
      };

      when(repository.find).mockResolvedValue(items);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      const encodedCursor = result.previousCursor;
      expect(encodedCursor).not.toBeNull();

      const newPaginationDto = new CursorPaginationDto();
      Object.assign(newPaginationDto, {
        cursor: encodedCursor,
        limit: 1,
        direction: 'next',
      });

      when(repository.find)
        .calledWith({
          where: [{ id: MoreThan('6') }],
          order: { id: 'ASC' },
          take: 2,
          relations: {},
        })
        .mockResolvedValue([{ id: 7 }]);

      await service.paginateWithCursor(repository, newPaginationDto, options);

      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: [{ id: MoreThan('6') }],
        }),
      );
    });
  });
});
