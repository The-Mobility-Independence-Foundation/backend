import { Injectable, BadRequestException } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';
import {
  Repository,
  FindOptionsWhere,
  FindOptionsRelations,
  LessThanOrEqual,
  MoreThanOrEqual,
  Between,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from './entities/user-auth.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthProviderProfile } from '../auth/entities/auth-provider-profile.entity';
import { UserAuthService } from './user-auth.service';
import { validateDto } from '../common/utils/validate-dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { ConnectionsService } from '../connections/connections.service';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userAuthService: UserAuthService,
    private connectionsService: ConnectionsService,
  ) {}

  /**
   * Find a user by email
   * @param email - The email address of the user
   * @param options - Optional query options
   * @returns The user record or null if not found
   */
  async findByEmail(
    email: string,
    options: Partial<{
      where: FindOptionsWhere<Omit<User, 'email'>>;
      relations: FindOptionsRelations<User>;
    }> = {},
  ): Promise<User | null> {
    const { where = {}, relations } = options;

    return this.userRepository.findOne({
      where: {
        ...where,
        email: email.toLowerCase(),
      },
      relations,
    });
  }

  /**
   * Create a new user
   * @param data - The data to create the user with
   * @returns The user record
   */
  async create(data: RegisterDto | AuthProviderProfile): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    const existingUserAuth = await this.userAuthService.findByIdentifier(
      data.email,
    );

    if (existingUser || existingUserAuth) {
      throw new BadRequestException(
        'A user with this email address already exists',
      );
    }

    let user = new User();
    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.displayName = data.displayName;
    user.type = UserRole.GUEST;
    user.inactive = false;
    user.rating = 0;

    let userAuth: UserAuth;
    if (data instanceof RegisterDto) {
      userAuth = await this.userAuthService.initializeLocalAuth(
        data.email,
        data.password,
      );
    } else {
      userAuth = await this.userAuthService.initializeProviderAuth(data);
    }

    user.auth = userAuth;
    user = await validateDto(user, User);

    return this.userRepository.save(user);
  }

  /**
   * Get the connections of a user through pagination
   * @param userId - The id of the user
   * @param paginationDto - The pagination dto
   * @returns The paginated list of user connections
   */
  async getConnections(userId: number, paginationDto: CursorPaginationDto) {
    return this.connectionsService.findAll(userId, paginationDto);
  }

  /**
   * Create a connection between two users
   * @param userId - The id of the user
   * @param recipientId - The id of the recipient
   * @returns The recipient user
   */
  async createConnection(userId: number, recipientId: number) {
    return this.connectionsService.create(userId, recipientId);
  }

  /**
   * Delete a connection between two users
   * @param userId - The id of the user
   * @param recipientId - The id of the recipient
   * @returns The recipient user
   */
  async deleteConnection(userId: number, recipientId: number) {
    return this.connectionsService.delete(userId, recipientId);
  }

  /**
   * Returns all users from the database that match the search critera
   * @param query - The search criteria
   * @returns An array of the users
   */
  async findAll(query: GetUsersDto) {
    const findOptions: any = {};
    const findWhere: any = {};
    const findOrder: any = {
      id: 'ASC',
    };
    const findSelect: any = {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      type: true,
    };

    if (query.nextToken) {
      findOptions.skip = query.nextToken;
    }

    if (query.count) {
      findOptions.take = query.count;
    }

    if (query.username) {
      findWhere.displayName = query.username;
    }

    if (query.accountType) {
      findWhere.type = query.accountType;
    }

    if (query.maxRating && query.minRating) {
      findWhere.rating = Between(query.minRating, query.maxRating);
    } else if (query.maxRating) {
      findWhere.rating = LessThanOrEqual(query.maxRating);
    } else if (query.minRating) {
      findWhere.rating = MoreThanOrEqual(query.minRating);
    }

    findOptions.where = findWhere;
    findOptions.order = findOrder;
    findOptions.select = findSelect;

    return this.userRepository.find(findOptions);
  }

  /**
   * Find a user by id
   * @param id - The id of the user
   * @param options - Optional query options
   * @returns The user record
   */
  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<User, 'id'>>;
      relations: FindOptionsRelations<User>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const user = await this.userRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
    });

    if (user) {
      return user;
    } else {
      throw new BadRequestException('User does not exist.');
    }
  }

  /**
   * Updates a user based on their id and the provided dto
   * @param id - The id of the user to update
   * @param dto - The fields to change and their new values
   * @returns The updated user, if they existed, otherwise a BadRequestException
   */
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findById(id);

    if (dto.firstName) {
      user.firstName = dto.firstName;
    }
    if (dto.lastName) {
      user.lastName = dto.lastName;
    }
    if (dto.displayName) {
      user.displayName = dto.displayName;
    }
    if (dto.accountType) {
      user.type = dto.accountType;
    }

    return this.userRepository.save(user);
  }
}
