import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDetail {
  @ApiProperty({ example: "First name can't be empty" })
  message: string;

  @ApiProperty({ example: ['isNotEmpty'] })
  constraints: string[];

  @ApiProperty({ example: 'John' })
  value: any;
}

export class ValidationErrorResponse {
  @ApiProperty({ type: () => Object })
  errors: Record<string, ValidationErrorDetail>;
}
