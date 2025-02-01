import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PrefixService } from './prefix.service';
import {Prefix} from './prefix.entity';

describe('PrefixService', () => {
  let service: PrefixService;

  const mockPrefixRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockForumRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrefixService,
        {
          provide: getRepositoryToken(Prefix),
          useValue: mockPrefixRepository, // Mocking PrefixRepository
        },
        {
          provide: 'ForumRepository', // If it's injected as @Inject('ForumRepository')
          useValue: mockForumRepository,
        },
      ],
    }).compile();

    service = module.get<PrefixService>(PrefixService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
