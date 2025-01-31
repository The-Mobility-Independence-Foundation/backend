import { Test, TestingModule } from '@nestjs/testing';
import { WordfilterController } from './wordfilter.controller';
import { WordfilterService } from './wordfilter.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wordfilter } from './wordfilter.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('WordfilterController', () => {
  let controller: WordfilterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordfilterController],
      providers: [
        WordfilterService,
        {
          provide: getRepositoryToken(Wordfilter),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<WordfilterController>(WordfilterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
