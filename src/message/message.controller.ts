import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @Post()
  // create(): Promise<Message> {
  //   return this.messageService.create();
  // }

  // @Get()
  // findAll(): Promise<Message[]> {
  //   return this.messageService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number): Promise<Message | null> {
  //   return this.messageService.findOne(id);
  // }
}
