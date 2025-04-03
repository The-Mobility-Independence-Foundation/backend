import {
  DeleteObjectCommandInput,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { when } from 'jest-when';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { Attachment, AttachmentEntityType } from '../attachment.entity';
import { AttachmentsService } from '../attachments.service';

jest.mock('uuid', () => ({
  v7: jest.fn().mockReturnValue('mocked-uuid'),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://test-signed-url.com'),
}));

const mockS3Client = {
  send: jest.fn(),
};

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => mockS3Client),
  PutObjectCommand: jest.fn((input: PutObjectCommandInput) => ({
    input,
  })),
  DeleteObjectCommand: jest.fn((input: DeleteObjectCommandInput) => ({
    input,
  })),
  GetObjectCommand: jest.fn((input: GetObjectCommandInput) => ({
    input,
  })),
}));

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let attachmentRepository: Repository<Attachment>;
  let mockGetSignedUrl: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: createMock<Repository<Attachment>>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            getOrThrow: jest.fn((key: string) => {
              switch (key) {
                case 'CLOUDFLARE_R2_JURISDICTION_ENDPOINT':
                  return 'https://test-endpoint.com';
                case 'CLOUDFLARE_R2_ACCESS_KEY_ID':
                  return 'test-access-key';
                case 'CLOUDFLARE_R2_SECRET_ACCESS_KEY':
                  return 'test-secret-key';
                case 'CLOUDFLARE_R2_BUCKET_NAME':
                  return 'test-bucket';
                default:
                  return '';
              }
            }),
          }),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(AttachmentsService);
    attachmentRepository = module.get(getRepositoryToken(Attachment));
    mockGetSignedUrl = getSignedUrl as jest.Mock;
    jest.clearAllMocks();
  });

  describe('findByEntity', () => {
    it('should find attachments by entity id and type', async () => {
      const entityId = 1;
      const entityType = AttachmentEntityType.POST;
      const attachments = [new Attachment(), new Attachment()];

      when(attachmentRepository.find)
        .calledWith({
          where: {
            entityId,
            entityType,
            deletedAt: IsNull(),
          },
          relations: undefined,
        })
        .mockResolvedValue(attachments);

      const result = await service.findByEntity(entityId, entityType);

      expect(result).toBeDefined();
      expect(result).toEqual(attachments);
    });

    it('should find attachments with additional where conditions', async () => {
      const entityId = 1;
      const entityType = AttachmentEntityType.POST;

      const where: FindOptionsWhere<Attachment> = { authorId: 2 };
      const relations: FindOptionsRelations<Attachment> = { author: true };
      const attachments = [new Attachment(), new Attachment()];

      when(attachmentRepository.find)
        .calledWith({
          where: {
            entityId,
            entityType,
            deletedAt: IsNull(),
            ...where,
          },
          relations,
        })
        .mockResolvedValue(attachments);

      const result = await service.findByEntity(entityId, entityType, {
        where,
        relations,
      });

      expect(result).toBeDefined();
      expect(result).toEqual(attachments);
    });
  });

  describe('formatKey', () => {
    it('should format the key correctly', () => {
      const entityType = AttachmentEntityType.POST;
      const uuid = 'test-uuid';

      const key = service.formatKey(entityType, uuid);

      expect(key).toBe(`${entityType}/${uuid}`);
    });
  });

  describe('formatUrlByKey', () => {
    it('should format the URL correctly by key', () => {
      const key = 'post/test-uuid';

      const url = service.formatUrlByKey(key);

      expect(url).toBe(`https://test-bucket.r2.cloudflarestorage.com/${key}`);
    });
  });

  describe('formatUrlByEntity', () => {
    it('should format the URL correctly by entity', () => {
      const entityType = AttachmentEntityType.POST;
      const uuid = 'test-uuid';

      const url = service.formatUrlByEntity(entityType, uuid);

      expect(url).toBe(
        `https://test-bucket.r2.cloudflarestorage.com/${entityType}/${uuid}`,
      );
    });
  });

  describe('uploadFiles', () => {
    it('should upload files successfully', async () => {
      const entityId = 1;
      const entityType = AttachmentEntityType.POST;
      const authorId = 2;
      const files = [
        {
          buffer: Buffer.from('test file 1'),
          originalname: 'test1.jpg',
          size: 1024,
          mimetype: 'image/jpeg',
        },
        {
          buffer: Buffer.from('test file 2'),
          originalname: 'test2.pdf',
          size: 2048,
          mimetype: 'application/pdf',
        },
      ] as Express.Multer.File[];

      const attachments: Attachment[] = files.map((file) => {
        const attachment = new Attachment();
        Object.assign(attachment, {
          entityId,
          entityType,
          key: `${entityType}/mocked-uuid`,
          fileName: file.originalname,
          fileSize: file.size.toString(),
          mimeType: file.mimetype,
          authorId,
        });

        when(attachmentRepository.create)
          .calledWith(attachment)
          .mockReturnValue(attachment);

        return attachment;
      });

      attachmentRepository.save = jest.fn().mockResolvedValue(attachments);

      const result = await service.uploadFiles(
        entityId,
        entityType,
        files,
        authorId,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(attachments);
      expect(mockS3Client.send).toHaveBeenCalledTimes(2);
      expect(attachmentRepository.save).toHaveBeenCalledWith(attachments);

      files.forEach((file) => {
        expect(mockS3Client.send).toHaveBeenCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              Bucket: 'test-bucket',
              Key: `${entityType}/mocked-uuid`,
              Body: file.buffer,
              ContentType: file.mimetype,
            }),
          }),
        );
      });
    });

    it('should handle upload failure and clean up', async () => {
      const entityId = 1;
      const entityType = AttachmentEntityType.POST;
      const authorId = 2;
      const files = [
        {
          buffer: Buffer.from('test file'),
          originalname: 'test.jpg',
          size: 1024,
          mimetype: 'image/jpeg',
        },
      ] as Express.Multer.File[];

      mockS3Client.send.mockRejectedValueOnce(
        new Error('Mocking failed upload'),
      );

      await expect(
        service.uploadFiles(entityId, entityType, files, authorId),
      ).rejects.toThrow(
        new BadRequestException(
          'Failed to upload files, please try again later',
        ),
      );

      expect(mockS3Client.send).toHaveBeenCalledTimes(2);
      expect(mockS3Client.send).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          input: expect.objectContaining({
            Bucket: 'test-bucket',
            Key: `${entityType}/mocked-uuid`,
          }),
        }),
      );
    });

    it('should handle delete failure during cleanup', async () => {
      const entityId = 1;
      const entityType = AttachmentEntityType.POST;
      const authorId = 2;
      const files = [
        {
          buffer: Buffer.from('test file'),
          originalname: 'test.jpg',
          size: 1024,
          mimetype: 'image/jpeg',
        },
      ] as Express.Multer.File[];

      mockS3Client.send.mockRejectedValueOnce(
        new Error('Mocking failed upload'),
      );
      mockS3Client.send.mockRejectedValueOnce(
        new Error('Mocking failed delete'),
      );

      await expect(
        service.uploadFiles(entityId, entityType, files, authorId),
      ).rejects.toThrow(
        new BadRequestException(
          'Failed to upload files, please try again later',
        ),
      );

      expect(mockS3Client.send).toHaveBeenCalledTimes(2);
      expect(mockS3Client.send).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          input: expect.objectContaining({
            Bucket: 'test-bucket',
            Key: `${entityType}/mocked-uuid`,
          }),
        }),
      );
    });
  });

  describe('generateGetPresignedUrl', () => {
    it('should generate a presigned URL', async () => {
      const key = 'post/test-uuid';
      const signedUrl = 'https://test-signed-url.com';
      const expiresIn = 3600;

      when(mockGetSignedUrl)
        .calledWith(
          mockS3Client,
          expect.objectContaining({
            input: expect.objectContaining({
              Bucket: 'test-bucket',
              Key: key,
            }),
          }),
          { expiresIn },
        )
        .mockResolvedValue(signedUrl);

      const result = await service.generateGetPresignedUrl(key, expiresIn);

      expect(result).toEqual({ url: signedUrl });
    });

    it('should use default expiration time if not provided', async () => {
      const key = 'post/test-uuid';
      const signedUrl = 'https://test-signed-url.com';

      when(mockGetSignedUrl)
        .calledWith(
          mockS3Client,
          expect.objectContaining({
            input: expect.objectContaining({
              Bucket: 'test-bucket',
              Key: key,
            }),
          }),
          { expiresIn: AttachmentsService.EXPIRES_IN },
        )
        .mockResolvedValue(signedUrl);

      const result = await service.generateGetPresignedUrl(key);

      expect(result).toEqual({ url: signedUrl });
    });
  });

  describe('softDelete', () => {
    it('should soft delete an attachment', async () => {
      const attachmentId = 1;

      when(attachmentRepository.softDelete)
        .calledWith(attachmentId)
        .mockResolvedValue({
          raw: {},
          affected: 1,
          generatedMaps: [],
        });

      await service.softDelete(attachmentId);

      expect(attachmentRepository.softDelete).toHaveBeenCalledWith(
        attachmentId,
      );
    });
  });
});
