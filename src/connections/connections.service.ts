import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from './connection.entity';
import { User } from '../user/entities/user.entity';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private paginationService: PaginationService,
  ) {}

  /**
   * Find all connections for a user through pagination
   * @param followerId - The id of the follower
   * @param paginationDto - The pagination dto
   * @returns The paginated list of user connections
   */
  async findAll(
    followerId: number,
    paginationDto: CursorPaginationDto,
  ): Promise<BaseApiCursorPaginationResponse<Connection>> {
    return this.paginationService.paginateWithCursor(
      this.connectionRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: {
          followerId,
        },
      },
    );
  }

  /**
   * Check if a connection exists between two users
   * @param followerId - The id of the follower
   * @param followingId - The id of the following
   * @returns True if the connection exists, false otherwise
   */
  async doesConnectionExist(
    followerId: number,
    followingId: number,
  ): Promise<boolean> {
    return this.connectionRepository.exists({
      where: { followerId, followingId },
    });
  }

  /**
   * Creates a connection between two users
   * @param followerId - The id of the follower
   * @param followingId - The id of the following
   * @returns The created connection
   */
  async create(followerId: number, followingId: number): Promise<Connection> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot create a connection with yourself');
    }

    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });
    if (!following) {
      throw new BadRequestException(`Following user not found`);
    }

    if (await this.doesConnectionExist(followerId, followingId)) {
      throw new BadRequestException('Connection already exists');
    }

    return this.connectionRepository.save({
      followerId,
      followingId,
    });
  }

  /**
   * Deletes a connection between two users
   * @param followerId - The id of the follower
   * @param followingId - The id of the following
   */
  async delete(followerId: number, followingId: number): Promise<void> {
    if (!(await this.doesConnectionExist(followerId, followingId))) {
      throw new BadRequestException('Connection does not exist');
    }

    await this.connectionRepository.delete({
      followerId,
      followingId,
    });
  }
}
