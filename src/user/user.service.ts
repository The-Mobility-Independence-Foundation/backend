import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create() {
        const user = new User();
        user.organizationID = 1;
        user.firstName = "John";
        user.lastName = "Test";
        user.email = "johntest@gmail.com";
        user.password = "BadPassword123";
        user.displayName = "UniqueUsername";

        return this.userRepository.save(user);
    }

    async findAll() {
        
        return this.userRepository.find();
        
    }

    async findOne(id: number) {

        return this.userRepository.findOneBy({userID: id});

    }

}
