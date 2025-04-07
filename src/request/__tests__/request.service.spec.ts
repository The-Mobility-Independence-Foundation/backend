import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../request.service';
import { Request } from '../request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('RequestService', () => {
  let service: RequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: getRepositoryToken(Request),
          useValue: createMock<Repository<Request>>(),
        },
      ],
    })
    .useMocker(createMock)
    .compile();

    service = module.get<RequestService>(RequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
