import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate, IsNotEmpty } from 'class-validator';
/**
 * Attachment response
 */
export class AttachmentResponse {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id of the attachment', example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the attachment',
    example: 'image.png',
  })
  fileName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The size of the attachment',
    example: '1024',
  })
  fileSize: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The mime type of the attachment',
    example: 'image/png',
  })
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The key of the attachment',
    example: '1234567890',
  })
  key: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The url of the attachment',
    example: 'https://example.com/image.png',
  })
  url: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The created at date of the attachment',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
