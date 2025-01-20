import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Organization } from 'src/organization/organization.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
    ) {}

    async create() {
        const user = new User();

        const organization = await this.organizationRepository.findOneBy({organizationID: 1});
        user.organization = organization ? organization : null;
        user.firstName = "John";
        user.lastName = "Test";
        user.email = "johntest@gmail.com";
        user.password = "BadPassword123";
        user.displayName = "UniqueUsername1";

        const referredBy = await this.userRepository.findOneBy({userID: 2});
        if (referredBy) {
            user.referredBy = referredBy;
        }

        return this.userRepository.save(user);
    }

    async findAll() {
        
        return this.userRepository.find();
        
    }

    async findOne(id: number) {

        return this.userRepository.findOneBy({userID: id});

    }

}
