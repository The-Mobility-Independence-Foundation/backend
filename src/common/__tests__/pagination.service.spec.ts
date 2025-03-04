import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from '../services/pagination.service';
import { Repository, ObjectLiteral, LessThan, MoreThan } from 'typeorm';
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
          where: {
            id: MoreThan('5'),
            active: true,
          },
          order: {
            id: 'ASC',
            createdAt: 'DESC',
          },
          take: 4,
          relations: {},
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({ where: options.where })
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
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).not.toBeNull();
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
          where: {
            id: LessThan('5'),
            active: true,
          },
          order: {
            id: 'DESC',
          },
          take: 4,
          relations: {},
        })
        .mockResolvedValue(items);

      when(repository.count)
        .calledWith({
          where: {
            id: LessThan('2'),
            active: true,
          },
        })
        .mockResolvedValue(2);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toEqual(items);
      expect(result.hasNextPage).toBe(false);
      expect(result.count).toBeUndefined();
      expect(result.nextCursor).toBeNull();
      expect(result.previousCursor).not.toBeNull();
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
          take: 4,
          order: {
            id: 'ASC',
          },
          relations: {},
          where: {},
        })
        .mockResolvedValue(items);

      when(repository.count).calledWith({ where: {} }).mockResolvedValue(10);

      const result = await service.paginateWithCursor(
        repository,
        paginationDto,
        options,
      );

      expect(result).toBeDefined();
      expect(result.results).toHaveLength(3); // Should remove the extra item
      expect(result.hasNextPage).toBe(true);
      expect(result.count).toBe(10);
      expect(result.nextCursor).not.toBeNull();
      expect(result.previousCursor).not.toBeNull();
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
          where: {},
          order: {
            id: 'ASC',
          },
          take: 4,
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
          where: {
            id: MoreThan('5'),
          },
          order: {
            id: 'ASC',
          },
          take: 2,
          relations: {},
        })
        .mockResolvedValue([{ id: 7 }]);

      await service.paginateWithCursor(repository, newPaginationDto, options);

      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: MoreThan('5'),
          },
        }),
      );
    });
  });
});
