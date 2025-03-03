import { ApiProperty } from '@nestjs/swagger';

/**
 * Validation error detail response
 */
export class ValidationErrorDetail {
  @ApiProperty({ example: ['email must be a valid email'] })
  message: string[];

  @ApiProperty({ example: ['isEmail'] })
  constraints: string[];

  @ApiProperty({ example: 'not-valid-email' })
  value: any;
}

/**
 * Validation error response
 */
export class ValidationErrorResponse {
  @ApiProperty({ example: 'VALIDATION_FAILED' })
  code: string;

  @ApiProperty({ type: () => Object })
  errors: Record<string, ValidationErrorDetail>;
}
