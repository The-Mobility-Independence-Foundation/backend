import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Successfully retrieved user')
  @ApiOperation({ summary: 'Get the current user' })
  async getUser(@Req() req: Request): Promise<User> {
    return req.user as User;
  }

  @Get(':userId/connections')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Successfully retrieved user connections')
  @ApiOperation({ summary: 'Get user connections' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of user connections',
  })
  async getConnections(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: CursorPaginationDto,
  ) {
    return this.userService.getConnections(userId, paginationDto);
  }

  @Post(':userId/connections/:recipientId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Successfully created user connection')
  @ApiOperation({ summary: 'Create a user connection' })
  async createConnection(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ) {
    return this.userService.createConnection(userId, recipientId);
  }

  @Delete(':userId/connections/:recipientId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Successfully deleted user connection')
  @ApiOperation({ summary: 'Delete a user connection' })
  async deleteConnection(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ) {
    return this.userService.deleteConnection(userId, recipientId);
  }
}
