import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite, InviteType } from './invite.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Organization } from 'src/organization/organization.entity';

@Injectable()
export class InviteService {

    constructor(
        @InjectRepository(Invite)
        private inviteRepository: Repository<Invite>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
    ) {}

    async create() {
        const invite = new Invite();

        const sender = await this.userRepository.findOneBy({ id: 1 });
        const organization = await this.organizationRepository.findOneBy({ id: 1 });

        if (sender) { invite.sender = sender; }
        if (organization) { invite.organization = organization; }
        
        invite.recieverEmail = "johntest@rit.edu";
        invite.description = "John is my homie!";
        invite.invType = InviteType.ORGANIZATION; 

        return this.inviteRepository.save(invite);
    }

    async findAll() {
        
        return this.inviteRepository.find();
        
    }

    async findOne(id: number) {

        return this.inviteRepository.findOneBy({id: id});

    }

}
