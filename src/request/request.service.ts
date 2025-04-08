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
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { CreateOrganizationDto } from '../organization/dto/create-organization.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserRole } from '../user/entities/user.entity';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService
  ) {}

  /**
   * Create a new request to join the site
   * @param dto : All needed information to submit a request
   * @returns : A success message if made correctly
   */
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

  /**
   * Find all relevant requests
   * @param query : Any filters to sort the requests
   * @returns : A paginated list of all requests that fit that criteria
   */
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  async findAll(query: GetRequestsDto) {
    const findWhere = Object.assign(
      {},
      query.name && { name: query.name },
      query.firstName && { firstName: query.firstName },
      query.lastName && { lastName: query.lastName },
      query.email && { email: query.email },
      query.status && { status: query.status },
      query.approverId && { approverId: query.approverId },
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

  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  async findOne(id: number) {
    return this.requestRepository.findOneBy({ id: id });
  }

  /**
   * Changing information about a request
   * @param id : The id of the request being changed
   * @param dto : The information being changed in the request
   * @returns : A success message if updated correctly
   */
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
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

    if (dto.status === RequestStatus.ACCEPTED){
      await this.approvedRequest(request);
    }

    if (dto.approverId) {
      request.approver = await this.userService.findByIdOrThrow(dto.approverId);
    }

    return this.requestRepository.save(request);
  }

  /**
   * Find a single request by using the id
   * @param id : The id number of the request
   * @param options : Any relations that request may have
   * @returns : The request if it exists or an error
   */
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

  /**
   * Create an org and change user role when a request is approved
   * @param request : The request that has been approved
   * @returns : A success message if user is updated correctly
   */
  async approvedRequest(request: Request){
    const orgDto = new CreateOrganizationDto();
    const updateUserDto = new UpdateUserDto();
    const user = await this.userService.findByEmail(request.email);

    if (!user) {
      throw new NotFoundException('User with that email not found');
    }

    Object.assign(orgDto, {
      ownerId: user.id,
      name: request.name,
      ein: request.ein,
      phone: ' ',
    });

    Object.assign(updateUserDto, {
      accountType: UserRole.USER,
    });

    await this.organizationService.create(orgDto);
    return await this.userService.update(user.id, updateUserDto);
  }
}
