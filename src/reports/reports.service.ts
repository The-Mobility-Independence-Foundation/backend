import { BadRequestException, Injectable } from '@nestjs/common';
import { And, LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post as PostEntity } from '../post/post.entity';
import { User } from '../user/entities/user.entity';
import { Listing } from '../listing/listing.entity';
import { Report, ReportType } from './report.entity';
import { Comment } from '../comment/comment.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';

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

  async create(dto: CreateReportDto) {
    const report = new Report();

    if (dto.reporterId == dto.reportedUserId) {
      throw new BadRequestException('You cannot report yourself.');
    }

    const reporter = await this.userRepository.findOneBy({
      id: dto.reporterId,
    });
    const reportedUser = await this.userRepository.findOneBy({
      id: dto.reportedUserId,
    });

    if (!reporter) {
      throw new BadRequestException('Invalid reporterId');
    }
    report.reporter = reporter;

    if (!reportedUser) {
      throw new BadRequestException('ReportedUser not found.');
    }
    report.offender = reportedUser;

    switch (dto.reportType) {
      case ReportType.COMMENT:
        if (!dto.commentId) {
          throw new BadRequestException(
            'ReportType is comment, but no commentId provided.',
          );
        }

        const comment = await this.commentRepository.findOneBy({
          id: dto.commentId,
        });

        if (!comment) {
          throw new BadRequestException('Invalid commentId provided.');
        }

        report.comment = comment;
        break;
      case ReportType.LISTING:
        if (!dto.listingId) {
          throw new BadRequestException(
            'ReportType is listing, but no listingId provided.',
          );
        }

        const listing = await this.listingRepository.findOneBy({
          id: dto.listingId,
        });

        if (!listing) {
          throw new BadRequestException('Invalid listingId provided.');
        }

        report.listing = listing;
        break;
      case ReportType.POST:
        if (!dto.postId) {
          throw new BadRequestException(
            'ReportType is post, but no postId provided.',
          );
        }

        const post = await this.postRepository.findOneBy({ id: dto.postId });

        if (!post) {
          throw new BadRequestException('Invalid postId provided.');
        }

        report.post = post;
        break;
      case ReportType.PROFILE:
        // no validation needed
        break;
      default:
        throw new BadRequestException('Unsupported report type.');
    }

    report.reason = dto.reason;
    report.type = dto.reportType;

    return this.reportRepository.save(report);
  }

  async findAll(query: GetReportsDto) {
    const findOptions: any = {};
    const findWhere: any = {};
    const findOrder: any = {
      id: 'ASC',
    };

    if (query.nextToken) {
      findOptions.skip = query.nextToken;
    }

    if (query.count) {
      findOptions.take = query.count;
    }

    if (query.reporterId) {
      findWhere.reporterId = query.reporterId;
    }

    if (query.reportedUserId) {
      findWhere.offenderId = query.reportedUserId;
    }

    if (query.reportType) {
      findWhere.type = query.reportType;
    }

    if (query.before && query.after) {
      findWhere.reportedOn = And(LessThan(query.before), MoreThan(query.after));
    } else if (query.before) {
      findWhere.reportedOn = LessThan(query.before);
    } else if (query.after) {
      findWhere.reportedOn = MoreThan(query.after);
    }

    findOptions.where = findWhere;
    findOptions.order = findOrder;

    return this.reportRepository.find(findOptions);
  }

  async findOne(id: number) {
    const report = await this.reportRepository.findOneBy({ id: id });

    if (report) {
      return report;
    } else {
      throw new BadRequestException();
    }
  }

  async update(id: number, dto: UpdateReportDto) {
    const report = await this.reportRepository.findOneBy({ id: id });
    if (!report) {
      throw new BadRequestException('Invalid reportID.');
    }

    const moderator = await this.userRepository.findOneBy({
      id: dto.moderatorId,
    });
    if (!moderator) {
      throw new BadRequestException('Invalid moderatorID');
    }

    report.moderator = moderator;
    report.actionTaken = dto.actionTaken;
    report.actionTakenOn = new Date();

    return await this.reportRepository.save(report);
  }
}
