import { Test, TestingModule } from '@nestjs/testing';
import { ListingController } from './listing.controller';
import { createMock } from '@golevelup/ts-jest';

describe('ListingController', () => {
  let controller: ListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(ListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
