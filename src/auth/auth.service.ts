import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './dto/auth.entity';

export const users = [
  {
    email: 'fake@email.com',
    password: 'password',
  },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // we will replace this with a db lookup
    const user = users.find((user) => user.email === email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // use bcrypt here to check hashes
    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password.');
    }

    return { accessToken: this.jwtService.sign({ email: email }) };
  }
}
