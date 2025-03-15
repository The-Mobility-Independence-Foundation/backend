import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  And,
  FindOptionsRelations,
  FindOptionsWhere,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post as PostEntity } from '../post/post.entity';
import { User } from '../user/entities/user.entity';
import { Listing } from '../listing/listing.entity';
import { Report, ReportType } from './report.entity';
import { Comment } from '../comment/comment.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

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

    private paginationService: PaginationService,
  ) {}

  /**
   * Creates a new report using the dto
   * @param dto - The dto that contains all the info for the report
   * @returns The newly created report record
   */
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
      throw new NotFoundException('Invalid reporterId');
    }
    report.reporter = reporter;

    if (!reportedUser) {
      throw new NotFoundException('ReportedUser not found.');
    }
    report.offender = reportedUser;

    switch (dto.reportType) {
      case ReportType.COMMENT:
        if (!dto.commentId) {
          throw new BadRequestException(
            'ReportType is comment, but no commentId provided.',
          );
        }

        //TODO: once comment service has findById, use that
        const comment = await this.commentRepository.findOneBy({
          id: dto.commentId,
        });

        if (!comment) {
          throw new NotFoundException('Invalid commentId provided.');
        }

        report.comment = comment;
        break;
      case ReportType.LISTING:
        if (!dto.listingId) {
          throw new BadRequestException(
            'ReportType is listing, but no listingId provided.',
          );
        }

        // TODO: once listing has findById, use that
        const listing = await this.listingRepository.findOneBy({
          id: dto.listingId,
        });

        if (!listing) {
          throw new NotFoundException('Invalid listingId provided.');
        }

        report.listing = listing;
        break;
      case ReportType.POST:
        if (!dto.postId) {
          throw new BadRequestException(
            'ReportType is post, but no postId provided.',
          );
        }

        //TODO: once post service has findById, use that
        const post = await this.postRepository.findOneBy({ id: dto.postId });

        if (!post) {
          throw new NotFoundException('Invalid postId provided.');
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

  /**
   * Find all reports based on search criteria
   * @param query - The dto with the search criteria
   * @returns An array of reports
   */
  async findAll(query: GetReportsDto) {
    const findWhere: any = {};
    const paginationDto = new CursorPaginationDto();

    Object.assign(findWhere, {
      reporterId: query.reporterId,
      offenderId: query.reportedUserId,
      type: query.reportType,
    });

    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    if (query.before && query.after) {
      findWhere.reportedOn = And(LessThan(query.before), MoreThan(query.after));
    } else if (query.before) {
      findWhere.reportedOn = LessThan(query.before);
    } else if (query.after) {
      findWhere.reportedOn = MoreThan(query.after);
    }

    return this.paginationService.paginateWithCursor(
      this.reportRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
      },
    );
  }

  /**
   * Find a report by id
   * @param id - The id of the report
   * @param options - Optional query options
   * @returns The report record
   */
  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Report, 'id'>>;
      relations: FindOptionsRelations<Report>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const report = await this.reportRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
    });

    if (report) {
      return report;
    } else {
      throw new NotFoundException('Report does not exist.');
    }
  }

  /**
   * Update a report with moderator information
   * @param id - The id of the report
   * @param dto - The dto with what the moderator is doing
   * @returns The updated report record
   */
  async update(id: number, dto: UpdateReportDto) {
    const report = await this.findById(id);

    console.log('no error thrown');
    console.log(report);
    // TODO: once users branch is merged into dev, replace this with userService.findById
    const moderator = await this.userRepository.findOneBy({
      id: dto.moderatorId,
    });
    if (!moderator) {
      throw new NotFoundException('Invalid moderatorID');
    }

    Object.assign(report, {
      moderator: moderator,
      actionTaken: dto.actionTaken,
      actionTakenOn: new Date(),
    });

    return await this.reportRepository.save(report);
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
