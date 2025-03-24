import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for initiating a conversation
 */
export class InitiateConversationDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the participant',
    example: 1,
  })
  participantId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the listing',
    example: 1,
  })
  listingId?: number;
}
