import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../request.service';
import { Request } from '../request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
//import { PaginationService } from 'src/common/services/pagination.service';
//import { UserService } from 'src/user/user.service';
import { CreateRequestDto } from '../dto/create-request.dto';

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
});
