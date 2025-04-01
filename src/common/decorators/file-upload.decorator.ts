import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * Decorator to handle file uploads with Swagger documentation
 * @param options - Optional additional properties to include in the schema
 * @returns A decorator function
 */
export function FileUpload(
  options: {
    filePropertyName?: string;
    properties?: Record<string, SchemaObject | ReferenceObject>;
  } = {},
) {
  const { filePropertyName = 'files', properties = {} } = options;

  const fileSchema = {
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Files to be uploaded',
  };

  const schemaProperties: Record<string, SchemaObject | ReferenceObject> = {
    [filePropertyName]: fileSchema,
    ...properties,
  };

  return applyDecorators(
    UseInterceptors(FilesInterceptor(filePropertyName)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: schemaProperties,
      },
    }),
  );
}
