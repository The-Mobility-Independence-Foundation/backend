import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

/**
 * Validate a DTO by transforming it to an instance of the DTO class and validating it against the class-validator decorators.
 * @param dto - The DTO to validate
 * @param dtoClass - The class of the DTO
 * @returns The validated DTO
 */
export async function validateDto<T extends object>(
  dto: any,
  dtoClass: new () => T,
): Promise<T> {
  const transformed = plainToInstance(dtoClass, dto);
  const errors = await validate(transformed);

  if (errors.length > 0) {
    throw new ValidationException(errors);
  }

  return transformed as T;
}
