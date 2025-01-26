import { Controller, Post, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@Controller('tag')
export class TagController {

    constructor(private tagService: TagService) {}
        
    @Post()
    create(): Promise<Tag> {
        return this.tagService.create();
    }

    @Get()
    findAll(): Promise<Tag[]> {
        return this.tagService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Tag | null> {
        return this.tagService.findOne(id);
    }

}
