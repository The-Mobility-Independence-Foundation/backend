import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ParseFilePipe } from '@nestjs/common';

/**
 * Convert a size in megabytes to bytes
 * @param size - The size in megabytes
 * @returns The size in bytes
 */
export const mbToBytes = (size: number) => size * 1024 * 1024;

/**
 * Convert a size in bytes to megabytes
 * @param size - The size in bytes
 * @returns The size in megabytes
 */
export const bytesToMb = (size: number) => size / (1024 * 1024);

/**
 * Options for the file validation pipe
 */
export interface FilesValidationOptions {
  totalMaxSizeInMb?: number;
  totalMaxFileCount?: number;
  fileType?: RegExp;
  fileIsRequired?: boolean;
}

/**
 * A pipe that performs file validation on a list of files
 */
@Injectable()
export class FilesValidationPipe implements PipeTransform {
  public static readonly DEFAULT_TOTAL_MAX_FILE_COUNT = 5;
  public static readonly DEFAULT_TOTAL_MAX_SIZE_IN_MB = 10;
  public static readonly DEFAULT_FILE_TYPE = /(jpg|jpeg|png|pdf|doc|docx)$/i;

  private readonly parseFilePipe: ParseFilePipe;
  private readonly totalMaxSizeInMb: number;
  private readonly totalMaxFileCount: number;

  constructor(options: FilesValidationOptions = {}) {
    const {
      fileType = FilesValidationPipe.DEFAULT_FILE_TYPE,
      totalMaxSizeInMb = FilesValidationPipe.DEFAULT_TOTAL_MAX_SIZE_IN_MB,
      totalMaxFileCount = FilesValidationPipe.DEFAULT_TOTAL_MAX_FILE_COUNT,
      fileIsRequired = true,
    } = options;
    this.totalMaxSizeInMb = totalMaxSizeInMb;
    this.totalMaxFileCount = totalMaxFileCount;
    this.parseFilePipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType })
      .build({ fileIsRequired });
  }

  /**
   * Validate files ensuring their combined size doesn't exceed the limit
   * @param value - The files to validate
   * @returns The validated files
   */
  async transform(
    files: Express.Multer.File[],
  ): Promise<Express.Multer.File[]> {
    if (files.length > this.totalMaxFileCount) {
      throw new BadRequestException(
        `Maximum file count is ${this.totalMaxFileCount}. Current count: ${files.length}`,
      );
    }

    const totalSizeInBytes = files.reduce((sum, file) => sum + file.size, 0);
    const totalMaxSizeInBytes = mbToBytes(this.totalMaxSizeInMb);
    if (totalSizeInBytes > totalMaxSizeInBytes) {
      throw new BadRequestException(
        `Combined file size must be less than ${this.totalMaxSizeInMb}MB. Current total: ${bytesToMb(totalSizeInBytes).toFixed(2)}MB`,
      );
    }

    return await this.parseFilePipe.transform(files);
  }
}
