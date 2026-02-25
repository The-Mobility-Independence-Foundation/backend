import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthProviderProfile } from '../auth/entities/auth-provider-profile.entity';
import { UserAuth, AuthType } from './entities/user-auth.entity';
import { validateDto } from '../common/utils/validate-dto';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
  ) {}

  /**
   * Find a user auth by identifier (email)
   * @param identifier - The identifier (email) to search for
   * @param options - Optional query options
   * @returns The user auth record or null if not found
   */
  async findByIdentifier(
    identifier: string,
    options: Partial<{
      where: FindOptionsWhere<Omit<UserAuth, 'identifier'>>;
    }> = {},
  ): Promise<UserAuth | null> {
    const { where = {} } = options;

    return this.userAuthRepository.findOne({
      where: {
        ...where,
        identifier: identifier.toLowerCase(),
      },
      relations: { user: true },
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
   * @param authProviderProfile - The auth provider profile
   * @returns The user auth record
   */
  async initializeProviderAuth(
    authProviderProfile: AuthProviderProfile,
  ): Promise<UserAuth> {
    let userAuth = new UserAuth();
    userAuth.type = authProviderProfile.provider;
    userAuth.identifier = authProviderProfile.email;
    userAuth.providerAccountId = authProviderProfile.id;
    userAuth.refreshToken = authProviderProfile.refreshToken;
    userAuth.accessToken = authProviderProfile.accessToken;
    userAuth = await validateDto(userAuth, UserAuth);

    return userAuth;
  }
}
