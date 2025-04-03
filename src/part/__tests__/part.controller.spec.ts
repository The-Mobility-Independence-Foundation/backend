import { Test, TestingModule } from '@nestjs/testing';
import { PartController } from '../part.controller';
import { PartService } from '../part.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Part, PartType } from '../part.entity';
import { Tag } from '../../tag/tag.entity';
import { Model } from '../../model/model.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PartController', () => {
  let controller: PartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartController],
      providers: [
        PartService,
        {
          provide: getRepositoryToken(Part),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(PartType),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Model),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<PartController>(PartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
