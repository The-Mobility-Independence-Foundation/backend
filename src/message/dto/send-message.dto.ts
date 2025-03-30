import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for sending a message
 */
export class SendMessageDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  attachments?: Express.Multer.File[];
}
