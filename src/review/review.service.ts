import { Injectable } from '@nestjs/common';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create() {
    const review = new Review();

    const reviewer = await this.userRepository.findOneBy({ id: 1 });
    const reviewedUser = await this.userRepository.findOneBy({ id: 2 });
    const order = await this.orderRepository.findOneBy({ id: 2 });

    if (reviewer) {
      review.reviewer = reviewer;
    }
    if (reviewedUser) {
      review.reviewedUser = reviewedUser;
    }
    if (order) {
      review.order = order;
    }

    review.description = 'This sucks!';
    review.rating = 1;

    return this.reviewRepository.save(review);
  }

  async findAll() {
    return this.reviewRepository.find();
  }

  async findOne(id: number) {
    return this.reviewRepository.findOneBy({ id: id });
  }
}
