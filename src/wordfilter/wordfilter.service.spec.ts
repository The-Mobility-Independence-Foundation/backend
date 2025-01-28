import { Test, TestingModule } from '@nestjs/testing';
import { WordfilterService } from './wordfilter.service';

describe('WordfilterService', () => {
  let service: WordfilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordfilterService],
    }).compile();

    service = module.get<WordfilterService>(WordfilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
