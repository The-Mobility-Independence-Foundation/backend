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
        review.reviewerID = 1;
        review.reviewedUserID = 1;
        review.orderID = 1;
        review.description = "This sucks!";
        review.rating = 1;

        return this.reviewRepository.save(review);
    }

    async findAll() {
        
        return this.reviewRepository.find();
        
    }

    async findOne(id: number) {

        return this.reviewRepository.findOneBy({reviewID: id});

    }

}
