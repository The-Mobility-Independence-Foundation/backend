import { Attachment } from '../../attachments/attachment.entity';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({
    description: 'The id of the message',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The author of the message',
    example: {
      id: 1,
      organizationId: 1,
    },
  })
  author: User;

  @ApiProperty({
    description: 'The id of the conversation',
    example: 1,
  })
  conversationId: number;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, world!',
  })
  content?: string | null;

  @ApiProperty({
    description: 'The attachments of the message',
    example: [],
  })
  attachments: Attachment[];

  @ApiProperty({
    description: 'The created at date of the message',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the message',
    example: new Date(),
  })
  updatedAt: Date;
}
