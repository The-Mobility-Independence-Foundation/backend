import { Controller, Get, Param, Post } from '@nestjs/common';
import { Post as PostEntity  } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

    constructor(private postService: PostService){}

    @Post()
    create(): Promise<PostEntity>{
        return this.postService.create();
    }

    @Get()
    findAll(): Promise<PostEntity[]>{
        return this.postService.findAll();
    }
    
    @Get(':id')
    findOneBy(@Param('id') id: number): Promise<PostEntity | null>{
        return this.postService.findOne(id);
    }
}
