import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
  Post,
  Delete,
  Body,
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
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Get()
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

  /*
    Returns all users matching the given search criteria.
  */
  @Get()
  findAll(@Query() query: GetUsersDto): Promise<User[]> {
    return this.userService.findAllFiltered(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.update(id, dto);
  }
}
