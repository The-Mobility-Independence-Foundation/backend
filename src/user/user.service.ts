import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { ValidationException } from '../common/exceptions/validation.exception';
import { UserAuth } from './entities/user-auth.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { ProviderProfile } from '../auth/entities/provider-profile.entity';
import { UserAuthService } from './user-auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userAuthService: UserAuthService,
  ) {}

  /**
   * Find a user by email
   * @param email - The email address of the user
   * @param where - The where options
   * @returns The user record or null if not found
   */
  async findByEmail(
    email: string,
    where: Exclude<FindOneOptions<User>['where'], 'email'> = {},
  ) {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase(), ...where },
    });
  }

  /**
   * Create a new user
   * @param registerDto - The register dto
   * @param providerProfile - The provider profile
   * @returns The user record
   */
  async create(data: RegisterDto | ProviderProfile): Promise<User> {
    // Check if the user already exists
    const existingUser = await this.findByEmail(data.email);
    const existingUserAuth = await this.userAuthService.findByIdentifier(
      data.email,
    );
    if (existingUser || existingUserAuth) {
      throw new BadRequestException(
        'A user with this email address already exists',
      );
    }

    // Initialize the user
    const user = new User();
    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.displayName = data.displayName;

    // Initialize the user auth
    let userAuth: UserAuth;
    if (data instanceof RegisterDto) {
      userAuth = await this.userAuthService.initializeLocalAuth(
        data.email,
        data.password,
      );
    } else {
      userAuth = await this.userAuthService.initializeProviderAuth(data);
    }

    // Establish the relationship
    user.auth = userAuth;
    userAuth.user = user;

    // Validate the user auth
    const userAuthErrors = await validate(userAuth);
    if (userAuthErrors.length > 0) {
      throw new ValidationException(userAuthErrors);
    }

    // Validate the user
    const userErrors = await validate(user);
    if (userErrors.length > 0) {
      throw new ValidationException(userErrors);
    }

    // Save the user
    return this.userRepository.save(user);
  }
}
