import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from '../bookmarks.service';
import { Bookmark } from '../bookmarks.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { ListingsService } from '../../listings/listings.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { Listing } from '../../listings/listing.entity';
import { NotFoundException } from '@nestjs/common';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let repository: Repository<Bookmark>;
  let userService: UserService;
  let listingsService: ListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: getRepositoryToken(Bookmark),
          useValue: createMock<Repository<Bookmark>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(BookmarkService);
    repository = module.get(getRepositoryToken(Bookmark));
    userService = module.get(UserService);
    listingsService = module.get(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new bookmark', async () => {
      const user = new User();
      const listing = new Listing();
      Object.assign(user, {
        id: 1,
      });
      Object.assign(listing, {
        id: 2,
      });

      when(userService.findByIdOrThrow)
        .calledWith(user.id)
        .mockResolvedValue(user);
      when(listingsService.findByIdOrThrow)
        .calledWith(listing.id)
        .mockResolvedValue(listing);

      await service.create(user.id, listing.id);

      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findByIdOrThrow', () => {
    it('should throw a NotFoundError when bookmark does not exist', async () => {
      const bad_id = 999999999;

      when(repository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(bad_id)).rejects.toThrow(
        new NotFoundException('Bookmark does not exist.'),
      );
    });

    it('should return the bookmark when it exists', async () => {
      const bookmark = new Bookmark();
      Object.assign(bookmark, {
        id: 1,
      });

      when(repository.findOne)
        .calledWith({ where: { id: bookmark.id } })
        .mockResolvedValue(bookmark);

      const result = await service.findByIdOrThrow(bookmark.id);

      expect(result).toBeDefined();
      expect(result).toBe(bookmark);
    });
  });

  describe('findAll', () => {
    it('should find all', async () => {
      const bookmark = new Bookmark();

      when(repository.find)
        .calledWith(expect.anything())
        .mockResolvedValue([bookmark]);

      const result = await service.findAll(new CursorPaginationDto(), {
        userId: 1,
        listingId: 1,
      });
      expect(result).toBeDefined();
    });
  });
});
