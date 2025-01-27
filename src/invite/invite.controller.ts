import { Controller, Post, Get, Param } from '@nestjs/common';
import { InviteService } from './invite.service';
import { Invite } from './invite.entity';

@Controller('invite')
export class InviteController {

    constructor(private readonly inviteService: InviteService) {}
    
    @Post()
    create(): Promise<Invite> {
        return this.inviteService.create();
    }

    @Get()
    findAll(): Promise<Invite[]> {
        return this.inviteService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Invite | null> {
        return this.inviteService.findOne(id);
    }

}
