import {
  FilesValidationPipe,
  FilesValidationOptions,
  mbToBytes,
  bytesToMb,
} from '../pipes/files-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('FilesValidationPipe', () => {
  describe('transform', () => {
    it('should pass validation with valid files', async () => {
      const files = [
        {
          size: mbToBytes(1),
          mimetype: 'image/jpeg',
          originalname: 'test.jpg',
        } as Express.Multer.File,
        {
          size: mbToBytes(2),
          mimetype: 'image/png',
          originalname: 'test.png',
        } as Express.Multer.File,
      ];

      const pipe = new FilesValidationPipe();
      const result = await pipe.transform(files);

      expect(result).toBeDefined();
      expect(result).toBe(files);
    });

    it('should throw BadRequestException when file count exceeds limit', async () => {
      const files = [
        {
          size: mbToBytes(1),
          mimetype: 'image/jpeg',
          originalname: 'test1.jpg',
        } as Express.Multer.File,
        {
          size: mbToBytes(1),
          mimetype: 'image/jpeg',
          originalname: 'test2.jpg',
        } as Express.Multer.File,
        {
          size: mbToBytes(1),
          mimetype: 'image/jpeg',
          originalname: 'test3.jpg',
        } as Express.Multer.File,
      ];

      const options: FilesValidationOptions = {
        totalMaxFileCount: 2,
      };
      const pipe = new FilesValidationPipe(options);

      await expect(pipe.transform(files)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(files)).rejects.toThrow(
        `Maximum file count is ${options.totalMaxFileCount}. Current count: ${files.length}`,
      );
    });

    it('should throw BadRequestException when total file size exceeds limit', async () => {
      const files = [
        {
          size: mbToBytes(3),
          mimetype: 'image/jpeg',
          originalname: 'test1.jpg',
        } as Express.Multer.File,
        {
          size: mbToBytes(3),
          mimetype: 'image/jpeg',
          originalname: 'test2.jpg',
        } as Express.Multer.File,
      ];

      const options: FilesValidationOptions = {
        totalMaxSizeInMb: 5,
      };
      const pipe = new FilesValidationPipe(options);

      const totalSize = bytesToMb(
        files.reduce((sum, file) => sum + file.size, 0),
      ).toFixed(2);

      await expect(pipe.transform(files)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(files)).rejects.toThrow(
        `Combined file size must be less than ${options.totalMaxSizeInMb}MB. Current total: ${totalSize}MB`,
      );
    });

    it('should use default options when none are provided', async () => {
      const files = [];
      const maxFileCount = FilesValidationPipe.DEFAULT_TOTAL_MAX_FILE_COUNT;
      for (let i = 0; i < maxFileCount + 1; i++) {
        files.push({
          size: mbToBytes(1),
          mimetype: 'image/jpeg',
          originalname: `test${i}.jpg`,
        } as Express.Multer.File);
      }

      const pipe = new FilesValidationPipe();
      await expect(pipe.transform(files)).rejects.toThrow(
        new BadRequestException(
          `Maximum file count is ${maxFileCount}. Current count: ${files.length}`,
        ),
      );
    });
  });

  describe('utility functions', () => {
    it('should convert MB to bytes correctly', () => {
      expect(mbToBytes(1)).toBe(1048576);
      expect(mbToBytes(5)).toBe(5242880);
    });

    it('should convert bytes to MB correctly', () => {
      expect(bytesToMb(1048576)).toBe(1);
      expect(bytesToMb(5242880)).toBe(5);
    });
  });
});
