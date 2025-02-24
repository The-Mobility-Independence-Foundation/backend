import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { ValidationException } from '../common/exceptions/validation.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
  }): Promise<User> {
    // If a user with this email address already exists, throw an error
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email.toLowerCase() },
    });
    if (existingUser) {
      throw new BadRequestException(
        'A user with this email address already exists',
      );
    }

    const user = new User();
    user.firstName = data.firstName.trim();
    user.lastName = data.lastName.trim();
    user.email = data.email.toLowerCase();
    user.displayName = data.displayName.trim();

    // TODO: Update this once we have a proper signup flow
    user.signupComplete = true;

    // Validate the user object
    const errors = await validate(user);
    if (errors.length > 0) {
      console.log(errors);
      throw new ValidationException(errors);
    }

    return this.userRepository.save(user);
  }
}
