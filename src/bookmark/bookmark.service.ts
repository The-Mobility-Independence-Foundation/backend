import { Injectable } from '@nestjs/common';
import { Bookmark } from './bookmark.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookmarkService {

    constructor(
        @InjectRepository(Bookmark)
        private bookmarkRepository: Repository<Bookmark>,
    ) {}

    async create() {
        const bookmark = new Bookmark();
        bookmark.userID = 1;
        bookmark.listingID = 1;

        return this.bookmarkRepository.save(bookmark);
    }

    async findAll() {
        
        return this.bookmarkRepository.find();
        
    }

    async findOne(id: number) {

        return this.bookmarkRepository.findOneBy({bookmarkID: id});

    }

}
