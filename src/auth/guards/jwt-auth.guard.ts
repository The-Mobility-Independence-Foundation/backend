import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for JWT authentication, regardless of the strategy used.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
