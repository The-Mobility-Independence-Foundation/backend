import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsService } from '../connections.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from '../entities/connection.entity';

describe('ConnectionsService', () => {
  let service: ConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionsService,
        {
          provide: getRepositoryToken(Connection),
          useValue: createMock<Repository<Connection>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ConnectionsService>(ConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
