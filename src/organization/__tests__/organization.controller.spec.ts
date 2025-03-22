import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from '../organization.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../organization.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('OrganizationController', () => {
  let controller: OrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        {
          provide: getRepositoryToken(Organization),
          useValue: createMock<Repository<Organization>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(OrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
