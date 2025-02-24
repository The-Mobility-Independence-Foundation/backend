import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuth, AuthType } from './entities/user-auth.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ProviderProfile } from '../auth/entities/provider-profile.entity';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
  ) {}

  async getUserByEmail(email: string) {
    return this.userAuthRepository.findOne({
      where: { identifier: email },
      relations: ['user'],
    });
  }

  async updateUserAuth(userAuth: UserAuth) {
    return this.userAuthRepository.save(userAuth);
  }

  async createEmailAuth(user: User, email: string, password: string) {
    const userAuth = new UserAuth();
    userAuth.user = user;
    userAuth.type = AuthType.LOCAL;
    userAuth.identifier = email;
    userAuth.credentials = await bcrypt.hash(password, 10);

    return this.userAuthRepository.save(userAuth);
  }

  async createProviderAuth(user: User, providerProfile: ProviderProfile) {
    const userAuth = new UserAuth();
    userAuth.user = user;
    userAuth.type = providerProfile.provider;
    userAuth.identifier = providerProfile.email;
    userAuth.providerAccountId = providerProfile.id;
    userAuth.refreshToken = providerProfile.refreshToken;
    userAuth.accessToken = providerProfile.accessToken;
    userAuth.accessTokenExpiresAt = null;

    return this.userAuthRepository.save(userAuth);
  }

  async validateCredentials(email: string, password: string) {
    const userAuth = await this.userAuthRepository.findOne({
      where: {
        type: AuthType.LOCAL,
        identifier: email,
      },
      relations: ['user'],
    });

    if (!userAuth || !userAuth.credentials) {
      return null;
    }

    const isValid = await bcrypt.compare(password, userAuth.credentials);
    return isValid ? userAuth.user : null;
  }
}
