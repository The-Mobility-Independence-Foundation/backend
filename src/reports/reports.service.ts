import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post as PostEntity } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Listing } from '../listing/listing.entity';
import { Report, ReportType } from './report.entity';
import { Comment } from '../comment/comment.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,

    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create() {
    const report = new Report();

    const reporter = await this.userRepository.findOneBy({ id: 1 });
    const listing = await this.listingRepository.findOneBy({ id: 1 });
    const moderator = await this.userRepository.findOneBy({ id: 2 });

    if (reporter) {
      report.reporter = reporter;
    }
    if (listing) {
      report.listing = listing;
    }
    if (moderator) {
      report.moderatorID = moderator;
    }

    report.reason = 'fake profile';
    report.type = ReportType.LISTING;

    return this.reportRepository.save(report);
  }

  async findAll() {
    return this.reportRepository.find();
  }

  async findOne(id: number) {
    return this.reportRepository.findOneBy({ id: id });
  }
}
