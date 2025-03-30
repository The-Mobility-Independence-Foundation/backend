import { MessageResponse } from './message.response';
import { ApiProperty } from '@nestjs/swagger';
import { Attachment } from 'src/attachments/attachment.entity';

export class SendMessageResponse extends MessageResponse {
  @ApiProperty({
    description: 'The attachments of the message',
    example: [],
    type: [Attachment],
  })
  attachments: Attachment[];
}
