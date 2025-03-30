import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

/**
 * Decorator to handle file uploads with Swagger documentation
 * @returns A decorator function
 */
export function FileUpload() {
  return applyDecorators(
    UseInterceptors(FilesInterceptor('files')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'The files to upload',
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
}
