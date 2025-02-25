import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ProviderProfile } from '../auth/entities/provider-profile.entity';
import { UserAuth, AuthType } from './entities/user-auth.entity';
import { validateDto } from '../common/utils/validate-dto';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
  ) {}

  /**
   * Find a user auth by identifier
   * @param identifier - The identifier of the user auth
   * @param where - The where options
   * @returns The user auth record or null if not found
   */
  async findByIdentifier(
    identifier: string,
    where: Exclude<FindOneOptions<UserAuth>['where'], 'identifier'> = {},
  ): Promise<UserAuth | null> {
    return this.userAuthRepository.findOne({
      where: { identifier: identifier.toLowerCase(), ...where },
      relations: ['user'],
    });
  }

  /**
   * Initialize a local auth record
   * @param email - The email address of the user
   * @param password - The password of the user
   * @returns The user auth record
   */
  async initializeLocalAuth(
    email: string,
    password: string,
  ): Promise<UserAuth> {
    let userAuth = new UserAuth();
    userAuth.type = AuthType.LOCAL;
    userAuth.identifier = email;
    userAuth.credentials = password;
    userAuth = await validateDto(userAuth, UserAuth);

    userAuth.credentials = await bcrypt.hash(password, 10);

    return userAuth;
  }

  /**
   * Initialize a provider auth record
   * @param providerProfile - The provider profile
   * @returns The user auth record
   */
  async initializeProviderAuth(
    providerProfile: ProviderProfile,
  ): Promise<UserAuth> {
    let userAuth = new UserAuth();
    userAuth.type = providerProfile.provider;
    userAuth.identifier = providerProfile.email;
    userAuth.providerAccountId = providerProfile.id;
    userAuth.refreshToken = providerProfile.refreshToken;
    userAuth.accessToken = providerProfile.accessToken;
    userAuth = await validateDto(userAuth, UserAuth);

    return userAuth;
  }

  /**
   * Validate the credentials of a local auth record
   * @param identifier - The identifier of the user
   * @param credentials - The credentials of the user
   * @returns The user record or null if the credentials are invalid
   */
  async validateCredentials(
    identifier: string,
    credentials: string,
  ): Promise<User> {
    const userAuth = await this.findByIdentifier(identifier, {
      type: AuthType.LOCAL,
    });
    if (!userAuth || !userAuth.credentials) {
      throw new BadRequestException('Credentials not found');
    }

    const isValid = await bcrypt.compare(credentials, userAuth.credentials);
    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return userAuth.user;
  }
}
