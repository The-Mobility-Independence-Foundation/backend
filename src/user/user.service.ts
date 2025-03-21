import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';
import { Repository, FindOptionsWhere, FindOptionsRelations } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from './entities/user-auth.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthProviderProfile } from '../auth/entities/auth-provider-profile.entity';
import { UserAuthService } from './user-auth.service';
import { validateDto } from '../common/utils/validate-dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userAuthService: UserAuthService,
    private paginationService: PaginationService,
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
   * Returns all users from the database that match the search critera
   * @param query - The search criteria
   * @returns An array of the users
   */
  async findAll(query: GetUsersDto) {
    const findWhere: any = {};
    const paginationDto = new CursorPaginationDto();

    Object.assign(findWhere, {
      displayName: query.username,
      type: query.accountType,
    });

    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    return this.paginationService.paginateWithCursor(
      this.userRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
      },
    );
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
      console.log('im being hit!');
      return user;
    } else {
      throw new NotFoundException('User does not exist.');
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

    Object.assign(user, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      displayName: dto.displayName,
      type: dto.accountType,
    });

    return this.userRepository.save(user);
  }
}
