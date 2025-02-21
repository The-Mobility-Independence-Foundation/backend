import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
  }) {
    const user = new User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.displayName = data.displayName;

    // TODO: Update this once we have a proper signup flow
    user.signupComplete = true;

    return this.userRepository.save(user);
  }
}
