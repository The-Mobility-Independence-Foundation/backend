import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuthService } from '../user/user-auth.service';
import { ProviderProfile } from './entities/provider-profile.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { UserRegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Register a new user
   */
  async register(userRegisterDto: UserRegisterDto): Promise<User> {
    const existingAuth = await this.userAuthService.getUserByEmail(
      userRegisterDto.email,
    );

    // If user already exists, throw an unauthorized exception
    if (existingAuth) {
      throw new UnauthorizedException(
        'An account already exists with this email',
      );
    }

    // Create new user
    const user = await this.userService.create({
      email: userRegisterDto.email,
      displayName: userRegisterDto.displayName,
      firstName: userRegisterDto.firstName,
      lastName: userRegisterDto.lastName,
    });

    // Create email/password auth for the user
    const userAuth = await this.userAuthService.createEmailAuth(
      user,
      userRegisterDto.email,
      userRegisterDto.password,
    );

    return userAuth.user;
  }

  /**
   * Handle provider login
   */
  async handleProviderLogin(providerProfile: ProviderProfile): Promise<User> {
    const userAuth = await this.userAuthService.getUserByEmail(
      providerProfile.email,
    );

    if (userAuth) {
      // Check if user exists but with different provider (prevent account hijacking)
      if (userAuth.type !== providerProfile.provider) {
        this.logger.warn(
          `User ${providerProfile.email} attempted to login with different provider`,
        );
        throw new UnauthorizedException(
          'An account already exists with this email using a different login method',
        );
      }

      // Update existing user auth
      const updatedUserAuth = await this.userAuthService.updateUserAuth({
        ...userAuth,
        accessToken: providerProfile.accessToken,
        refreshToken: providerProfile.refreshToken,
      });

      return updatedUserAuth.user;
    }

    // Create new user and auth
    try {
      const user = await this.userService.create({
        firstName: providerProfile.firstName,
        lastName: providerProfile.lastName,
        email: providerProfile.email,
        displayName: providerProfile.displayName,
      });

      const newUserAuth = await this.userAuthService.createProviderAuth(
        user,
        providerProfile,
      );

      return newUserAuth.user;
    } catch (error) {
      this.logger.error(
        `Failed to create user for provider ${providerProfile.provider}`,
        error,
      );
      throw new UnauthorizedException('Failed to create user account');
    }
  }

  generateToken(email: string): string {
    return this.jwtService.sign({ email });
  }
}
