import { Test, TestingModule } from '@nestjs/testing';
import { PartTypeController } from '../part-type.controller';

describe('PartTypeController', () => {
  let controller: PartTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartTypeController],
    }).compile();

    controller = module.get<PartTypeController>(PartTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
