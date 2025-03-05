import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsService } from '../connections.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from '../entities/connection.entity';
import { Repository, DeleteResult } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { BadRequestException } from '@nestjs/common';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';

describe('ConnectionsService', () => {
  let service: ConnectionsService;
  let connectionRepository: Repository<Connection>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionsService,
        {
          provide: getRepositoryToken(Connection),
          useValue: createMock<Repository<Connection>>(),
        },
        {
          provide: PaginationService,
          useValue: createMock<PaginationService>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(ConnectionsService);
    connectionRepository = module.get(getRepositoryToken(Connection));
    paginationService = module.get(PaginationService);
  });

  describe('findAll', () => {
    it('should find all connections for a user with pagination', async () => {
      const followerId = 1;
      const paginationDto = new CursorPaginationDto();
      const expectedResponse =
        new BaseApiCursorPaginationResponse<Connection>();
      Object.assign(expectedResponse, {
        results: [new Connection(), new Connection()],
        nextCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
      });

      when(paginationService.paginateWithCursor)
        .calledWith(connectionRepository, paginationDto, {
          cursorColumn: 'id',
          where: { followerId },
        })
        .mockResolvedValue(expectedResponse);

      const result = await service.findAll(followerId, paginationDto);

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(result.results).toHaveLength(expectedResponse.results.length);
      expect(result.nextCursor).toBe(expectedResponse.nextCursor);
      expect(result.hasNextPage).toBe(expectedResponse.hasNextPage);
      expect(result.hasPreviousPage).toBe(expectedResponse.hasPreviousPage);
    });
  });

  describe('doesConnectionExist', () => {
    it('should return true if connection exists', async () => {
      const followerId = 1;
      const followingId = 2;

      when(connectionRepository.exists)
        .calledWith({
          where: { followerId, followingId },
        })
        .mockResolvedValue(true);

      const result = await service.doesConnectionExist(followerId, followingId);

      expect(result).toBe(true);
    });

    it('should return false if connection does not exist', async () => {
      const followerId = 1;
      const followingId = 2;

      when(connectionRepository.exists)
        .calledWith({
          where: { followerId, followingId },
        })
        .mockResolvedValue(false);

      const result = await service.doesConnectionExist(followerId, followingId);

      expect(result).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a new connection between users', async () => {
      const followerId = 1;
      const followingId = 2;
      const connection = new Connection();
      Object.assign(connection, {
        followerId,
        followingId,
      });

      when(connectionRepository.exists)
        .calledWith({
          where: { followerId, followingId },
        })
        .mockResolvedValue(false);

      when(connectionRepository.save)
        .calledWith({
          followerId,
          followingId,
        })
        .mockResolvedValue(connection);

      const result = await service.create(followerId, followingId);

      expect(result).toBeDefined();
      expect(result).toBe(connection);
      expect(result.followerId).toBe(followerId);
      expect(result.followingId).toBe(followingId);
    });

    it('should throw BadRequestException if connection already exists', async () => {
      const followerId = 1;
      const followingId = 2;

      when(connectionRepository.exists)
        .calledWith({
          where: { followerId, followingId },
        })
        .mockResolvedValue(true);

      await expect(service.create(followerId, followingId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing connection', async () => {
      const followerId = 1;
      const followingId = 2;

      when(connectionRepository.exists)
        .calledWith({
          where: { followerId, followingId },
        })
        .mockResolvedValue(true);

      const deleteResult: DeleteResult = {
        affected: 1,
        raw: {},
      };

      when(connectionRepository.delete)
        .calledWith({
          followerId,
          followingId,
        })
        .mockResolvedValue(deleteResult);

      await service.delete(followerId, followingId);

      expect(connectionRepository.delete).toHaveBeenCalledWith({
        followerId,
        followingId,
      });
    });

    it('should throw BadRequestException if connection does not exist', async () => {
      const followerId = 1;
      const followingId = 2;

      when(connectionRepository.exists)
        .calledWith({
          where: { followerId, followingId },
        })
        .mockResolvedValue(false);

      await expect(service.delete(followerId, followingId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
