import { Injectable } from '@nestjs/common';
import { Forum } from './forum.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ForumService {

    constructor(
        @InjectRepository(Forum)
        private forumRepository: Repository<Forum>
    ){}

    async create(){
        const forum = new Forum();

        const parentForum = await this.forumRepository.findOneBy({ id: 1 });
        if (parentForum) {forum.parentForum = parentForum;}

        forum.name = "Power Chairs";
        forum.description = "Talking about power chairs and issues";
        forum.isCategory = false;
        forum.order = 1;
        forum.isLocked = false;
        forum.numberOfPosts = 2;
        forum.numberOfThreads = 1;

        return this.forumRepository.save(forum);
    }

    async findAll(){
        return this.forumRepository.find();
    }

    async findOne(id: number){
        return this.forumRepository.findOneBy({id: id});
    }
}
