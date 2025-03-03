import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  ValidationErrorDetail,
  ValidationErrorResponse,
} from '../responses/validation-error.response';

/**
 * Exception thrown when validation fails
 */
export class ValidationException extends BadRequestException {
  constructor(private readonly errors: ValidationError[]) {
    const validationErrorResponse: ValidationErrorResponse = {
      code: 'VALIDATION_FAILED',
      errors: ValidationException.formatErrors(errors),
    };

    super(validationErrorResponse);
  }

  /**
   * Override getResponse to specify the return type
   */
  getResponse(): ValidationErrorResponse {
    return super.getResponse() as ValidationErrorResponse;
  }

  /**
   * Format the validation errors
   * @param errors - The validation errors
   * @param parentProperty - The parent property
   * @returns The formatted errors
   */
  private static formatErrors(
    errors: ValidationError[],
    parentProperty?: string,
  ): Record<string, ValidationErrorDetail> {
    return errors.reduce(
      (acc, error) => {
        const property = parentProperty
          ? `${parentProperty}.${error.property}`
          : error.property;

        // Handle direct constraints on this property
        if (error.constraints) {
          acc[property] = {
            message: Object.values(error.constraints),
            constraints: Object.keys(error.constraints),
            value: error.value,
          };
        }

        // Process nested validation errors
        if (error.children && error.children.length > 0) {
          Object.assign(
            acc,
            ValidationException.formatErrors(error.children, property),
          );
        }

        return acc;
      },
      {} as Record<string, ValidationErrorDetail>,
    );
  }
}
