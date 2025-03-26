import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerService } from '../manufacturer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer } from '../../model.entity';
import { ManufacturerController } from '../manufacturer.controller';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('ModelController', () => {
  let controller: ManufacturerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturerController],
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: createMock<Repository<Manufacturer>>(),
        },
      ],
    })
    .useMocker(createMock)
    .compile();

    controller = module.get<ManufacturerController>(ManufacturerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
