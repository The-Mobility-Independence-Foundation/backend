import { Injectable } from '@nestjs/common';
import { Wordfilter } from './wordfilter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class WordfilterService {

    constructor(
        @InjectRepository(Wordfilter)
        private WordfilterRepository: Repository<Wordfilter>
    ) {}

    async create() {
        const wordfilter = new Wordfilter();

        wordfilter.badWord = "fuck";
        wordfilter.replacement = "fudge";

        return this.WordfilterRepository.save(wordfilter);
    }

    async findAll() {
        
        return this.WordfilterRepository.find();
        
    }

    async findOne(id: number) {

        return this.WordfilterRepository.findOneBy({id: id});

    }

}
