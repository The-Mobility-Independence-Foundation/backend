import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Organization } from './organization.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(Organization), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(User), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Inventory), 
          useClass: mockRepository
        },
      ]
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
