import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { createMock } from '@golevelup/ts-jest';

describe('AddressController', () => {
  let controller: AddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(AddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
