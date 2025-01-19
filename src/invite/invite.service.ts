import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite, InviteType } from './invite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InviteService {

    constructor(
        @InjectRepository(Invite)
        private inviteRepository: Repository<Invite>,
    ) {}

    async create() {
        const invite = new Invite();
        invite.senderID = 0;
        invite.organizationID = 0;
        invite.recieverEmail = "johntest@rit.edu";
        invite.description = "John is my homie!";
        invite.invType = InviteType.ORGANIZATION;

        return this.inviteRepository.save(invite);
    }

    async findAll() {
        
        return this.inviteRepository.find();
        
    }

    async findOne(id: number) {

        return this.inviteRepository.findOneBy({inviteID: id});

    }

}
