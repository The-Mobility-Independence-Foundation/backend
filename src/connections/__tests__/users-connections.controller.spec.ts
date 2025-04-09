import { Test, TestingModule } from '@nestjs/testing';
import { UsersConnectionsController } from '../users-connections.controller';
import { ConnectionsService } from '../connections.service';
import { createMock } from '@golevelup/ts-jest';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { when } from 'jest-when';
import { Connection } from '../connection.entity';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';
import { STRATEGY_PROVIDERS_TOKEN } from '../../common/resource-access/interfaces/strategy-provider.interface';
import { ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('UsersConnectionsController', () => {
  let controller: UsersConnectionsController;
  let service: ConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersConnectionsController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(UsersConnectionsController);
    service = module.get(ConnectionsService);
  });

  describe('getConnections', () => {
    it('should successfully retrieve user connections', async () => {
      const userId = 1;
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: 'cursor123',
        limit: 10,
        direction: 'next',
      });

      const expectedResponse =
        new BaseApiCursorPaginationResponse<Connection>();
      Object.assign(expectedResponse, {
        results: [new Connection(), new Connection()],
        nextCursor: 'nextCursor123',
        hasNextPage: true,
        hasPreviousPage: false,
      });

      when(service.findAll)
        .calledWith(userId, paginationDto)
        .mockResolvedValue(expectedResponse);

      const result = await controller.getConnections(userId, paginationDto);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(service.findAll).toHaveBeenCalledWith(userId, paginationDto);
    });
  });

  describe('createConnection', () => {
    it('should successfully create a user connection', async () => {
      const userId = 1;
      const recipientId = 2;

      const expectedConnection = new Connection();
      Object.assign(expectedConnection, {
        id: 1,
        followerId: userId,
        followingId: recipientId,
        createdAt: new Date(),
      });

      when(service.create)
        .calledWith(userId, recipientId)
        .mockResolvedValue(expectedConnection);

      const result = await controller.createConnection(userId, recipientId);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedConnection);
      expect(service.create).toHaveBeenCalledWith(userId, recipientId);
    });
  });

  describe('deleteConnection', () => {
    it('should successfully delete a user connection', async () => {
      const userId = 1;
      const recipientId = 2;

      when(service.delete)
        .calledWith(userId, recipientId)
        .mockResolvedValue(undefined);

      const result = await controller.deleteConnection(userId, recipientId);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(userId, recipientId);
    });
  });
});
