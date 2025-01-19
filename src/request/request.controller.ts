import { Controller, Post, Get, Param } from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from './request.entity';

@Controller('request')
export class RequestController {

    constructor(private requestService: RequestService) {}
    
    @Post()
    create(): Promise<Request> {
        return this.requestService.create();
    }

    @Get()
    findAll(): Promise<Request[]> {
        return this.requestService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Request | null> {
        return this.requestService.findOne(id);
    }

}
