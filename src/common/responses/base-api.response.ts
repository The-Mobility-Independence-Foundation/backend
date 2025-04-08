import { ApiProperty } from '@nestjs/swagger';

/**
 * Base API response
 * @template T - The type of the data
 */
export class BaseApiResponse<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful', nullable: true })
  message: string | null;

  @ApiProperty({ nullable: true })
  data: T | null;

  @ApiProperty({ nullable: true, required: false })
  error?: string | null;
}
