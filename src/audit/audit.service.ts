import { Injectable } from '@nestjs/common';
import { Audit, AuditAction, AuditEntity } from './audit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(): Promise<Audit> {
    const audit = new Audit();

    const user = await this.userRepository.findOneBy({ id: 1 });
    const organization = await this.organizationRepository.findOneBy({ id: 1 });

    if (user) {
      audit.user = user;
    }
    if (organization) {
      audit.organization = organization;
    }

    audit.action = AuditAction.CREATED;
    audit.entity = AuditEntity.INVENTORY_ITEM;

    return this.auditRepository.save(audit);
  }

  async findOne(id: number): Promise<Audit | null> {
    return this.auditRepository.findOneBy({ id: id });
  }

  async findAll(): Promise<Audit[]> {
    return this.auditRepository.find();
  }
}
