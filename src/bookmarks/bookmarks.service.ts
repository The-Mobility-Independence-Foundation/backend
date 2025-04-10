import { Injectable, NotFoundException } from '@nestjs/common';
import { Bookmark } from './bookmarks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ListingsService } from '../listings/listings.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,

    private readonly userService: UserService,
    private readonly listingsService: ListingsService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(userId: number, listingId: number) {
    const user = await this.userService.findByIdOrThrow(userId);
    const listing = await this.listingsService.findByIdOrThrow(listingId);

    const bookmark = new Bookmark();
    Object.assign(bookmark, {
      user: user,
      listing: listing,
    });

    return this.bookmarkRepository.save(bookmark);
  }

  async findAll(
    dto: CursorPaginationDto,
    ids?: { listingId?: number; userId?: number },
  ) {
    const findWhere = {};

    if (ids && ids.listingId) {
      Object.assign(findWhere, {
        listing: {
          id: ids.listingId,
        },
      });
    }

    if (ids && ids.userId) {
      Object.assign(findWhere, {
        user: {
          id: ids.userId,
        },
      });
    }

    return this.paginationService.paginateWithCursor(
      this.bookmarkRepository,
      dto,
      {
        cursorColumn: 'id',
        where: findWhere,
        relations: {
          listing: true,
        },
      },
    );
  }

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Bookmark, 'id'>>;
      relations: FindOptionsRelations<Bookmark>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
    });

    if (bookmark) {
      return bookmark;
    } else {
      throw new NotFoundException('Bookmark does not exist.');
    }
  }

  async delete(userId: number, listingId: number) {
    return this.bookmarkRepository.delete({
      user: { id: userId },
      listing: { id: listingId },
    });
  }
}
