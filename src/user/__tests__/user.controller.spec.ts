import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../../organization/organization.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Connection } from '../../connections/entities/connection.entity';
import { when } from 'jest-when';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: createMock<Repository<Organization>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return the user from the request', async () => {
      const user = new User();
      Object.assign(user, {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const req = {
        user,
      } as Partial<Request> as Request;

      const result = await controller.getUser(req);

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });
  });

  describe('getConnections', () => {
    it('should return paginated connections for a user', async () => {
      const userId = 1;
      const paginationDto = new CursorPaginationDto();
      const expectedResponse =
        new BaseApiCursorPaginationResponse<Connection>();
      Object.assign(expectedResponse, {
        results: [new Connection(), new Connection()],
        nextCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
      });

      when(userService.getConnections)
        .calledWith(userId, paginationDto)
        .mockResolvedValue(expectedResponse);

      const result = await controller.getConnections(userId, paginationDto);

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(userService.getConnections).toHaveBeenCalledWith(
        userId,
        paginationDto,
      );
    });
  });

  describe('createConnection', () => {
    it('should create a connection between users', async () => {
      const userId = 1;
      const recipientId = 2;
      const connection = new Connection();
      Object.assign(connection, {
        followerId: userId,
        followingId: recipientId,
      });

      when(userService.createConnection)
        .calledWith(userId, recipientId)
        .mockResolvedValue(connection);

      const result = await controller.createConnection(userId, recipientId);

      expect(result).toBeDefined();
      expect(result).toBe(connection);
      expect(userService.createConnection).toHaveBeenCalledWith(
        userId,
        recipientId,
      );
    });
  });

  describe('deleteConnection', () => {
    it('should delete a connection between users', async () => {
      const userId = 1;
      const recipientId = 2;

      when(userService.deleteConnection)
        .calledWith(userId, recipientId)
        .mockResolvedValue(undefined);

      await controller.deleteConnection(userId, recipientId);

      expect(userService.deleteConnection).toHaveBeenCalledWith(
        userId,
        recipientId,
      );
    });
  });
});
