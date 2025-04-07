import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../request.service';
import { Request, RequestStatus } from '../request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { PaginationService } from '../../common/services/pagination.service';
import { UserService } from '../../user/user.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import { NotFoundException } from '@nestjs/common';
import { when } from 'jest-when';
import { User } from '../../user/entities/user.entity';
import { GetRequestsDto } from '../dto/get-request.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

describe('RequestService', () => {
  let service: RequestService;
  let requestRepository: Repository<Request>;
  let paginationService: PaginationService;
  let userService: UserService;

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
    paginationService = module.get(PaginationService);
    userService = module.get(UserService);
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

  describe('findAll', () => {
    let getDto = new GetRequestsDto();
    const user = new User();
    const request = new Request();

    beforeAll(() => {
      Object.assign(user, { id: 1 });
      Object.assign(request, {
        id: 1,
        name: 'BBS',
        ein: 'AB43',
        firstName: 'Lebron',
        lastName: 'James',
        email: 'leEmail@leGmail.com',
        description: 'jhsbd',
        approver: user,
        status: RequestStatus.ACCEPTED,
      });
    });

    beforeEach(() => {
      getDto = new GetRequestsDto();
    });

    it('should use approver search when an approver id is specified', async () => {
      Object.assign(getDto, {
        approverId: user.id,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        requestRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            approverId: user.id,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });
    it('should use name search when a name is specified', async () => {
      Object.assign(getDto, {
        name: request.name,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        requestRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            name: request.name,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });
    it('should use status search when a status is specified', async () => {
      Object.assign(getDto, {
        status: request.status,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        requestRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            status: request.status,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });
    it('should apply pagination parameters correctly', async () => {
      Object.assign(getDto, {
        cursor: '12345',
        limit: 10,
        direction: 'forward',
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        requestRepository,
        expect.objectContaining({
          cursor: getDto.cursor,
          limit: getDto.limit,
          direction: getDto.direction,
        }),
        expect.objectContaining({}),
      );
    });
    it('should use first name search when a first name is specified', async () => {
      Object.assign(getDto, {
        firstName: request.firstName,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        requestRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            firstName: request.firstName,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });
    it('should use last name search when a last name is specified', async () => {
      Object.assign(getDto, {
        lastName: request.lastName,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        requestRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            lastName: request.lastName,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });
    it('should use email search when an email is specified', async () => {
      Object.assign(getDto, {
        email: request.email,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        requestRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            email: request.email,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });
  });
});
