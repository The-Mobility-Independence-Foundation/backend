import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request, RequestStatus } from './request.entity';
import { UserService } from '../user/user.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { GetRequestsDto } from './dto/get-request.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateRequestDto) {
    const request = new Request();
    request.ein = dto.ein;
    request.firstName = dto.firstName;
    request.lastName = dto.lastName;
    request.email = dto.ein;
    request.description = dto.description;
    request.name = dto.name;

    return this.requestRepository.save(request);
  }

  async findAll(query: GetRequestsDto) {
    const findWhere = Object.assign(
      {},
      query.name && { name: query.name },
      query.firstName && { firstName: query.firstName },
      query.lastName && { lastName: query.lastName },
      query.email && { email: query.email },
      query.status && { status: query.status },
      query.approverId && { approverId: query.approverId },
      query.on && { sentOn: query.on },
    );

    const paginationDto = new CursorPaginationDto();
    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    return this.paginationService.paginateWithCursor(
      this.requestRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
        relations: {
          approver: true,
        },
      },
    );
  }

  async findOne(id: number) {
    return this.requestRepository.findOneBy({ id: id });
  }

  async update(id: number, dto: UpdateRequestDto): Promise<Request> {
    const request = await this.findByIdOrThrow(id, {
      relations: {
        approver: true,
      },
    });

    if (dto.status) {
      request.status = dto.status;
      if (
        dto.status === RequestStatus.ACCEPTED ||
        dto.status === RequestStatus.DENIED
      ) {
        request.actionTakenOn = new Date();
      }
    }

    if (dto.approverId) {
      request.approver = await this.userService.findByIdOrThrow(dto.approverId);
    }

    return this.requestRepository.save(request);
  }

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Request, 'id'>>;
      relations: string[] | FindOptionsRelations<Request>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const request = await this.requestRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (request) {
      return request;
    } else {
      throw new NotFoundException('Request not found');
    }
  }
}
