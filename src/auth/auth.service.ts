import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuthService } from '../user/user-auth.service';
import { AuthProviderProfile } from './entities/auth-provider-profile.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthType } from '../user/entities/user-auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Register a new user through the local auth method
   * @param registerDto - The user registration data
   * @returns The newly registered user
   */
  async register(registerDto: RegisterDto): Promise<User> {
    return await this.userService.create(registerDto);
  }

  /**
   * Handle provider login
   * @param authProviderProfile - The auth provider profile
   * @returns The user or null if the user does not exist
   */
  async handleProviderLogin(
    authProviderProfile: AuthProviderProfile,
  ): Promise<User> {
    const existingUserAuth = await this.userAuthService.findByIdentifier(
      authProviderProfile.email,
    );

    if (existingUserAuth) {
      if (existingUserAuth.type !== authProviderProfile.provider) {
        throw new UnauthorizedException(
          'A user with this email address already exists with a different login method',
        );
      }

      return existingUserAuth.user;
    }

    return await this.userService.create(authProviderProfile);
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
    const userAuth = await this.userAuthService.findByIdentifier(identifier, {
      where: { type: AuthType.LOCAL },
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

  /**
   * Generate a JWT token for a user
   * @param email - The email of the user
   * @returns The JWT token
   */
  generateToken(email: string): string {
    return this.jwtService.sign({ email });
  }
}
