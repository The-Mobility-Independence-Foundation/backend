import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerService } from '../manufacturer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer } from '../../model.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ModelService', () => {
  let service: ManufacturerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ManufacturerService>(ManufacturerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
