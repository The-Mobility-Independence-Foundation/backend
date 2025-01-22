import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('RequestController', () => {
  let controller: RequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        RequestService,
        {
          provide: getRepositoryToken(Request), 
          useClass: mockRepository
        },
      ]
    }).compile();

    controller = module.get<RequestController>(RequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
