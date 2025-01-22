import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';
import { Listing } from '../listing/listing.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(User), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Organization), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Listing), 
          useClass: mockRepository
        },
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
