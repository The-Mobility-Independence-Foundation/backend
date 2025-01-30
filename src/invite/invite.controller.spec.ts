import { Test, TestingModule } from '@nestjs/testing';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invite } from './invite.entity';
import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('InviteController', () => {
  let controller: InviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InviteController],
      providers: [
        InviteService,
        {
          provide: getRepositoryToken(Invite),
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

    controller = module.get<InviteController>(InviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
