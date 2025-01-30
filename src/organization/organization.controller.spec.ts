import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { User } from '../user/user.entity';
import { Inventory } from '../inventory/inventory.entity';
import { OrganizationService } from './organization.service';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('OrganizationController', () => {
  let controller: OrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(Organization),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
