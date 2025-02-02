import { Test, TestingModule } from '@nestjs/testing';
import { PrefixController } from './prefix.controller';
import { Prefix } from './prefix.entity';
import { PrefixService } from './prefix.service';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PrefixController', () => {
  let controller: PrefixController;

  const mockPrefixService = {
    // Mock necessary methods if the controller calls them
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrefixController],
      providers: [
        {
          provide: PrefixService,
          useValue: mockPrefixService,
        },
        {
          provide: getRepositoryToken(Prefix),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<PrefixController>(PrefixController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
