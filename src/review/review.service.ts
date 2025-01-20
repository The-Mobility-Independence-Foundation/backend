import { Injectable } from '@nestjs/common';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewService {

    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) {}

    async create() {
        const review = new Review();
        review.reviewer = 1;
        review.reviewedUser = 1;
        review.order = 1;
        review.description = "This sucks!";
        review.rating = 1;

        return this.reviewRepository.save(review);
    }

    async findAll() {
        
        return this.reviewRepository.find();
        
    }

    async findOne(id: number) {

        return this.reviewRepository.findOneBy({id: id});

    }

}
