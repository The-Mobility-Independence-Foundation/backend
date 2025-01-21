import { Controller, Post, Get, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}
    
    @Post()
    create(): Promise<User> {
        return this.userService.create();
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<User | null> {
        return this.userService.findOne(id);
    }

}
