import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
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

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
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

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
