import { AuthType } from 'src/user/entities/user-auth.entity';

/**
 * The auth provider profile
 */
export class AuthProviderProfile {
  id: string;
  provider: Exclude<AuthType, AuthType.LOCAL>;
  accessToken: string;
  refreshToken: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}
