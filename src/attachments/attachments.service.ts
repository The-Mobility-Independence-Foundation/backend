import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Attachment, AttachmentEntityType } from './attachment.entity';

@Injectable()
export class AttachmentsService {
  public static readonly EXPIRES_IN = 60 * 60 * 24; // 1 day
  private client: S3Client;
  private bucketName: string;

  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    private configService: ConfigService,
  ) {
    this.client = new S3Client({
      region: 'auto',
      forcePathStyle: true,
      endpoint: this.configService.getOrThrow(
        'CLOUDFLARE_R2_JURISDICTION_ENDPOINT',
      ),
      credentials: {
        accessKeyId: this.configService.getOrThrow(
          'CLOUDFLARE_R2_ACCESS_KEY_ID',
        ),
        secretAccessKey: this.configService.getOrThrow(
          'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.bucketName = this.configService.getOrThrow(
      'CLOUDFLARE_R2_BUCKET_NAME',
    );
  }

  /**
   * Find attachments, that are not soft deleted, by entity id and type
   * @param entityId - The id of the entity the attachment belongs to
   * @param entityType - The type of the entity the attachment belongs to
   * @param options - The options for the query
   * @returns The attachments
   */
  async findByEntity(
    entityId: number,
    entityType: AttachmentEntityType,
    options: Partial<{
      where: FindOptionsWhere<Omit<Attachment, 'entityId' | 'entityType'>>;
      relations: FindOptionsRelations<Attachment>;
    }> = {},
  ): Promise<Attachment[]> {
    const { where = {}, relations } = options;

    return this.attachmentRepository.find({
      where: {
        entityId,
        entityType,
        deletedAt: IsNull(),
        ...where,
      },
      relations,
    });
  }

  /**
   * Format the key for the uploaded file
   * @param entityType - The type of the entity the attachment belongs to
   * @param uuid - The uuid of the uploaded file
   * @returns The key of the uploaded file
   */
  formatKey(entityType: AttachmentEntityType, uuid: string): string {
    return `${entityType}/${uuid}`;
  }

  /**
   * Upload multiple files to R2 and return the attachments
   * @param entityId - The id of the entity the attachment belongs to
   * @param entityType - The type of the entity the attachment belongs to
   * @param files - The files to upload
   * @param authorId - The id of the author of the attachment
   * @returns The attachments
   */
  async uploadFiles(
    entityId: number,
    entityType: AttachmentEntityType,
    files: Express.Multer.File[],
    authorId: number,
  ): Promise<Attachment[]> {
    const uploadedKeys: string[] = [];
    const commandPromises: Promise<PutObjectCommandOutput>[] = [];
    const attachments: Attachment[] = [];

    try {
      for (const file of files) {
        const key = this.formatKey(entityType, uuidv7());
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
          Metadata: {
            originalName: file.originalname,
            size: file.size.toString(),
          },
        });

        uploadedKeys.push(key);
        commandPromises.push(this.client.send(command));
        attachments.push(
          this.attachmentRepository.create({
            entityId,
            entityType,
            key,
            fileName: file.originalname,
            fileSize: file.size.toString(),
            mimeType: file.mimetype,
            authorId,
          }),
        );
      }

      await Promise.all(commandPromises);

      return await this.attachmentRepository.save(attachments);
    } catch {
      await Promise.all(
        uploadedKeys.map(async (key) => {
          try {
            await this.client.send(
              new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
              }),
            );
          } catch {}
        }),
      );

      throw new BadRequestException(
        'Failed to upload files, please try again later',
      );
    }
  }

  /**
   * Generate a presigned url for the uploaded file
   * @param key - The key of the uploaded file
   * @param expiresIn - The expiration time of the presigned url
   * @returns The presigned url of the uploaded file
   */
  async generateGetPresignedUrl(
    key: string,
    expiresIn: number = AttachmentsService.EXPIRES_IN,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.client, command, {
      expiresIn: expiresIn,
    });

    return url;
  }

  /**
   * Soft delete attachments by entity id and type
   * @param entityId - The id of the entity the attachment belongs to
   * @param entityType - The type of the entity the attachment belongs to
   */
  async softDeleteByEntity(
    entityId: number,
    entityType: AttachmentEntityType,
  ): Promise<void> {
    await this.attachmentRepository.softDelete({ entityId, entityType });
  }

  /**
   * Soft delete an attachment
   * @param attachmentId - The id of the attachment to soft delete
   */
  async softDelete(attachmentId: number): Promise<void> {
    await this.attachmentRepository.softDelete(attachmentId);
  }
}
