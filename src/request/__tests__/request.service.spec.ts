import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../request.service';
import { Request } from '../request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
//import { PaginationService } from 'src/common/services/pagination.service';
//import { UserService } from 'src/user/user.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import { NotFoundException } from '@nestjs/common';
import { when } from 'jest-when';

describe('RequestService', () => {
  let service: RequestService;
  let requestRepository: Repository<Request>;
  //let paginationService: PaginationService;
  //let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: getRepositoryToken(Request),
          useValue: createMock<Repository<Request>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<RequestService>(RequestService);
    requestRepository = module.get(getRepositoryToken(Request));
    //paginationService = module.get(PaginationService);
    //userService = module.get(UserService);
  });

  describe('create', () => {
    let createDto = new CreateRequestDto();

    beforeEach(() => {
      createDto = new CreateRequestDto();
    });

    it('should create a new request with a DTO', async () => {
      Object.assign(createDto, {
        name: 'Non Chalant Dreadheads 4 good',
        firstName: 'Tim',
        lastName: 'Mobile',
        ein: '12345678',
        email: 'locks4life@gmail.com',
        description: 'We want to help',
      });

      await expect(service.create(createDto)).resolves.not.toThrow();
      expect(requestRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByIdOrThrow', () => {
    it('should throw an error when given a bad id', async () => {
      const bad_id = 999999999;

      when(requestRepository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(bad_id)).rejects.toThrow(
        new NotFoundException('Request not found'),
      );
    });

    it('should return the request when id is valid', async () => {
      const request = new Request();
      Object.assign(request, {
        id: 1,
      });

      when(requestRepository.findOne)
        .calledWith({ where: { id: request.id } })
        .mockResolvedValue(request);

      const result = await service.findByIdOrThrow(request.id);

      expect(result).toBeDefined();
    });
  });
});
