import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from '../../listing/listing.entity';
import { Post as PostEntity } from '../../post/post.entity';
import { User } from '../../user/entities/user.entity';
import { Report, ReportType } from '../report.entity';
import { ReportsService } from '../reports.service';
import { Comment } from '../../comment/comment.entity';
import { And, LessThan, MoreThan, Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { GetReportsDto } from '../dto/get-reports.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { UserService } from '../../user/user.service';
import { CommentService } from '../../comment/comment.service';
import { PostService } from '../../post/post.service';
import { ListingService } from '../../listing/listing.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let reportRepository: Repository<Report>;
  let paginationService: PaginationService;
  let userService: UserService;
  let listingService: ListingService;
  let commentService: CommentService;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: createMock<Repository<Report>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(ReportsService);
    reportRepository = module.get(getRepositoryToken(Report));
    paginationService = module.get(PaginationService);
    userService = module.get(UserService);
    listingService = module.get(ListingService);
    postService = module.get(PostService);
    commentService = module.get(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let dto = new CreateReportDto();
    const reporter = new User();
    const offender = new User();
    const moderator = new User();
    const listing = new Listing();
    const post = new PostEntity();
    const comment = new Comment();

    beforeAll(() => {
      Object.assign(reporter, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'Reporter123',
      });

      Object.assign(offender, {
        id: 2,
        email: 'evil@test.com',
        firstName: 'Evil',
        lastName: 'Man',
        displayName: 'Offender123',
      });

      Object.assign(moderator, {
        id: 3,
        email: 'moderator@test.com',
        firstName: 'Mod',
        lastName: 'Rater',
        displayName: 'Moderator123',
      });

      Object.assign(listing, {
        id: 1,
      });

      Object.assign(post, {
        id: 1,
      });

      Object.assign(comment, {
        id: 1,
      });
    });

    beforeEach(() => {
      dto = new CreateReportDto();
    });

    it('should throw a BadRequestException when someone reports themselves', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 1,
        reason: "I'm reporting myself to see if it works!",
        reportType: ReportType.PROFILE,
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(reportRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException when ReportType is comment but commentId not specified', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's comment!",
        reportType: ReportType.COMMENT,
      });

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(reportRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException when ReportType is list but listingId not specified', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's listing!",
        reportType: ReportType.LISTING,
      });

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(reportRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException when ReportType is post but postId not specified', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's post!",
        reportType: ReportType.POST,
      });

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(reportRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException when ReportType is undefined', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's ??????!",
      });

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(reportRepository.save).not.toHaveBeenCalled();
    });

    it('returns the report when successfully created as a comment report', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's comment!",
        reportType: ReportType.COMMENT,
        commentId: 1,
      });

      dto.commentId = 1; // error handler wants to be super sure this isn't undefined

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      when(commentService.findByIdOrThrow)
        .calledWith(dto.commentId)
        .mockResolvedValue(comment);

      await expect(service.create(dto)).resolves.not.toThrow();
      expect(reportRepository.save).toHaveBeenCalled();
    });

    it('returns the report when successfully created as a listing report', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's listing!",
        reportType: ReportType.LISTING,
        listingId: 1,
      });

      dto.listingId = 1; // error handler wants to be super sure this isn't undefined

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      when(listingService.findByIdOrThrow)
        .calledWith(dto.listingId)
        .mockResolvedValue(listing);

      await expect(service.create(dto)).resolves.not.toThrow();
      expect(reportRepository.save).toHaveBeenCalled();
    });

    it('returns the report when successfully created as a post report', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's post!",
        reportType: ReportType.POST,
        postId: 1,
      });

      dto.postId = 1; // error handler wants to be super sure this isn't undefined

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      when(postService.findByIdOrThrow)
        .calledWith(dto.postId)
        .mockResolvedValue(post);

      await expect(service.create(dto)).resolves.not.toThrow();
      expect(reportRepository.save).toHaveBeenCalled();
    });

    it('returns the report when successfully created as a profile report', async () => {
      Object.assign(dto, {
        reporterId: 1,
        reportedUserId: 2,
        reason: "I'm reporting this guy's profile!",
        reportType: ReportType.PROFILE,
      });

      when(userService.findByIdOrThrow)
        .calledWith(dto.reporterId)
        .mockResolvedValue(reporter);

      when(userService.findByIdOrThrow)
        .calledWith(dto.reportedUserId)
        .mockResolvedValue(offender);

      await expect(service.create(dto)).resolves.not.toThrow();
      expect(reportRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    let dto = new GetReportsDto();

    beforeEach(() => {
      dto = new GetReportsDto();
    });

    it('should use And when both before and after are specified', async () => {
      Object.assign(dto, {
        before: new Date(),
        after: new Date(),
      });

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        reportRepository,
        new CursorPaginationDto(),
        expect.objectContaining({
          where: {
            reportedOn: And(LessThan(dto.before), MoreThan(dto.after)),
          },
        }),
      );
    });

    it('should use LessThan when only before is specified', async () => {
      Object.assign(dto, {
        before: new Date(),
      });

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        reportRepository,
        new CursorPaginationDto(),
        expect.objectContaining({
          where: {
            reportedOn: LessThan(dto.before),
          },
        }),
      );
    });

    it('should use MoreThan when only after is specified', async () => {
      Object.assign(dto, {
        after: new Date(),
      });

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        reportRepository,
        new CursorPaginationDto(),
        expect.objectContaining({
          where: {
            reportedOn: MoreThan(dto.after),
          },
        }),
      );
    });
  });

  describe('findByIdOrThrow', () => {
    let report = new Report();
    const reporter = new User();
    const offender = new User();

    beforeAll(() => {
      Object.assign(reporter, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'Reporter123',
      });

      Object.assign(offender, {
        id: 2,
        email: 'evil@test.com',
        firstName: 'Evil',
        lastName: 'Man',
        displayName: 'Offender123',
      });
    });

    beforeEach(() => {
      report = new Report();
    });

    it('should return a report if a report with the id exists', async () => {
      Object.assign(report, {
        id: 1,
        reporter: reporter,
        offender: offender,
        reportedOn: new Date(),
        type: ReportType.PROFILE,
      });

      when(reportRepository.findOne)
        .calledWith({ where: { id: report.id } })
        .mockResolvedValue(report);

      const result = await service.findByIdOrThrow(report.id);

      expect(result).toBeDefined();
      expect(result).toBe(report);
    });

    it('should throw an error if a user with the id doesnt exist', async () => {
      const bad_id = 999999999;

      when(reportRepository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(bad_id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    let dto = new UpdateReportDto();
    const reporter = new User();
    const offender = new User();
    const moderator = new User();
    const report = new Report();

    beforeAll(() => {
      Object.assign(reporter, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'Reporter123',
      });

      Object.assign(offender, {
        id: 2,
        email: 'evil@test.com',
        firstName: 'Evil',
        lastName: 'Man',
        displayName: 'Offender123',
      });

      Object.assign(moderator, {
        id: 3,
        email: 'moderator@test.com',
        firstName: 'Mod',
        lastName: 'Rater',
        displayName: 'Moderator123',
      });

      Object.assign(report, {
        id: 1,
      });
    });

    beforeEach(() => {
      dto = new UpdateReportDto();
    });

    it('should throw an error when report doesnt exist', async () => {
      const bad_id = 999999999;

      Object.assign(dto, {
        moderatorId: moderator.id,
        actionTaken: 'I banned his ass.',
      });

      when(reportRepository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      when(userService.findByIdOrThrow)
        .calledWith(moderator.id)
        .mockResolvedValue(moderator);

      await expect(service.update(bad_id, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(reportRepository.save).not.toHaveBeenCalled();
    });

    it('should return the updated report if reportid and moderatorid are both valid', async () => {
      Object.assign(dto, {
        moderatorId: moderator.id,
        actionTaken: 'I banned his ass.',
      });

      when(reportRepository.findOneBy)
        .calledWith({ id: report.id })
        .mockResolvedValue(report);

      when(userService.findByIdOrThrow)
        .calledWith(moderator.id)
        .mockResolvedValue(moderator);

      await expect(service.update(report.id, dto)).resolves.not.toThrow();
      expect(reportRepository.save).toHaveBeenCalled();
    });
  });
});
