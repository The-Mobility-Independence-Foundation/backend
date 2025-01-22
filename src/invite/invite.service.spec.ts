import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from './invite.service';
import { Invite } from './invite.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteService,
        {
          provide: getRepositoryToken(Invite), 
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
      ]
    }).compile();

    service = module.get<InviteService>(InviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
