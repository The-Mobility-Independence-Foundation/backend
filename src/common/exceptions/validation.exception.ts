import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    const formattedErrors = ValidationException.formatErrors(errors);
    super({
      code: 'VALIDATION_FAILED',
      errors: formattedErrors,
    });
  }

  private static formatErrors(errors: ValidationError[]) {
    return errors.reduce(
      (acc, error) => {
        if (error.constraints) {
          acc[error.property] = {
            message: Object.values(error.constraints)[0], // Get the first error message
            constraints: Object.keys(error.constraints),
            value: error.value,
          };
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }
}
