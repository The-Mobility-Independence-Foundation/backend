import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerService } from '../manufacturer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer } from '../../model.entity';
import { ManufacturerController } from '../manufacturer.controller';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ModelController', () => {
  let controller: ManufacturerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturerController],
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ManufacturerController>(ManufacturerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
