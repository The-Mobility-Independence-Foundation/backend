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
import { Report, ReportType } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { UserService } from '../user/user.service';
import { CommentService } from '../comment/comment.service';
import { ListingService } from '../listing/listing.service';
import { PostService } from '../post/post.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,

    private paginationService: PaginationService,
    private userService: UserService,
    private commentService: CommentService,
    private postService: PostService,
    private listingService: ListingService,
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

    report.reporter = await this.userService.findByIdOrThrow(dto.reporterId);
    report.offender = await this.userService.findByIdOrThrow(
      dto.reportedUserId,
    );

    switch (dto.reportType) {
      case ReportType.COMMENT:
        if (!dto.commentId) {
          throw new BadRequestException(
            'ReportType is comment, but no commentId provided.',
          );
        }

        report.comment = await this.commentService.findByIdOrThrow(
          dto.commentId,
        );
        break;
      case ReportType.LISTING:
        if (!dto.listingId) {
          throw new BadRequestException(
            'ReportType is listing, but no listingId provided.',
          );
        }

        report.listing = await this.listingService.findByIdOrThrow(
          dto.listingId,
        );
        break;
      case ReportType.POST:
        if (!dto.postId) {
          throw new BadRequestException(
            'ReportType is post, but no postId provided.',
          );
        }

        report.post = await this.postService.findByIdOrThrow(dto.postId);
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
  async findByIdOrThrow(
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
    const report = await this.findByIdOrThrow(id);

    report.moderator = await this.userService.findByIdOrThrow(dto.moderatorId);

    Object.assign(report, {
      actionTaken: dto.actionTaken,
      actionTakenOn: new Date(),
    });

    return await this.reportRepository.save(report);
  }
}
