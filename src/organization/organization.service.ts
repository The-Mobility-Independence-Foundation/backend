import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationService {

    constructor(
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
    ) {}

    async create() {
        const organization = new Organization();
        organization.inventoryID = 0;
        organization.userID = 0;
        organization.name = "The Mobility Independence Foundation";
        organization.address1 = "1789 State Highway 8";
        organization.city = "Mount Upton";
        organization.state = "New York";
        organization.zipcode = 13809;
        organization.ein = 920887459;

        return this.organizationRepository.save(organization);
    }

    async findAll() {
        
        return this.organizationRepository.find();
        
    }

    async findOne(id: number) {

        return this.organizationRepository.findOneBy({organizationID: id});

    }

}
