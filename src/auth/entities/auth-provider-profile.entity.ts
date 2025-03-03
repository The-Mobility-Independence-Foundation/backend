import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthType } from '../../user/entities/user-auth.entity';

/**
 * The auth provider profile
 */
export class AuthProviderProfile {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(AuthType)
  @IsNotEmpty()
  provider: Exclude<AuthType, AuthType.LOCAL>;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsOptional()
  image?: string;
}
