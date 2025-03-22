import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { Address } from '../address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
