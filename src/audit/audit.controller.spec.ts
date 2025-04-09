import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Audit } from './audit.entity';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/organization.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('AuditController', () => {
  let controller: AuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(Audit),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<AuditController>(AuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
