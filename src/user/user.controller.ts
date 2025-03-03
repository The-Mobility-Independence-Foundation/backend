import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Successfully retrieved user')
  @ApiOperation({ summary: 'Get the current user' })
  async getUser(@Req() req: Request): Promise<User> {
    return req.user as User;
  }
}
