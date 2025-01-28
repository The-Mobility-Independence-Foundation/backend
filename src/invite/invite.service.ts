import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite, InviteType } from './invite.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create() {
    const invite = new Invite();
  async create() {
    const invite = new Invite();

    const inviter = await this.userRepository.findOneBy({ id: 1 });
    const organization = await this.organizationRepository.findOneBy({ id: 1 });

    if (inviter) {
      invite.inviter = inviter;
    }
    if (organization) {
      invite.organization = organization;
    }

    invite.inviteeEmail = 'johntest@rit.edu';
    invite.description = 'John is my homie!';
    invite.type = InviteType.ORGANIZATION;

    return this.inviteRepository.save(invite);
  }
    return this.inviteRepository.save(invite);
  }

  async findAll() {
    return this.inviteRepository.find();
  }
  async findAll() {
    return this.inviteRepository.find();
  }

  async findOne(id: number) {
    return this.inviteRepository.findOneBy({ id: id });
  }
  async findOne(id: number) {
    return this.inviteRepository.findOneBy({ id: id });
  }
}
