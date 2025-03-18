import { IsString, IsOptional, IsArray } from 'class-validator';

/**
 * DTO for sending a message
 */
export class SendMessageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}
