import { Controller, Post, Get, Param } from '@nestjs/common';
import { ForumService } from './forum.service';
import { Forum } from './forum.entity';


@Controller('forum')
export class ForumController {
    constructor(private ForumService: ForumService){}

    @Post()
    create(): Promise<Forum>{
        return this.ForumService.create();
    }

    @Get()
    findAll(): Promise<Forum[]>{
        return this.ForumService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Forum | null>{
        return this.ForumService.findOne(id);
    }
}
