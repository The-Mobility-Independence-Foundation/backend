import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Part } from './part.entity';
import { Repository } from 'typeorm';
import { Model } from '../model/model.entity';

@Injectable()
export class PartService {

    constructor(
        @InjectRepository(Part)
        private readonly partRepository: Repository<Part>,

        @InjectRepository(Part)
        private readonly modelRepository: Repository<Model>,
    ) {}

    async create() {
        const part = new Part();
        const model = await this.modelRepository.findOneBy({ id: 1 });

        if (model) { part.model = model; }

        part.name = "Partname!";
        part.description = "";
        part.partNumber = "P12-345";

        return this.partRepository.save(part);
    }

    async findAll() {
        
        return this.partRepository.find();
        
    }

    async findOne(id: number) {

        return this.partRepository.findOneBy({id: id});

    }

}
