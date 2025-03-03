import { Injectable, BadRequestException } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';
import { Repository, FindOptionsWhere, FindOptionsRelations } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from './entities/user-auth.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthProviderProfile } from '../auth/entities/auth-provider-profile.entity';
import { UserAuthService } from './user-auth.service';
import { validateDto } from '../common/utils/validate-dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BaseApiPaginationResponse } from '../common/responses/base-api-pagination.response';

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

  async getUserConnections(
    id: number,
    paginationDto: PaginationDto,
  ): Promise<BaseApiPaginationResponse<User>> {
    return this.paginationService.paginate(this.userRepository, paginationDto, {
      where: { id },
      relations: {
        connectionsSent: true,
      },
    });
  }
}
