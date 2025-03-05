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
import { ResourceAccess } from '../auth/decorators/resource-access.decorator';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Get()
  @ResponseMessage('Successfully retrieved user')
  @ApiOperation({ summary: 'Get the current user' })
  async getUser(@Req() req: Request): Promise<User> {
    return req.user as User;
  }

  @Get(':userId/connections')
  @ResourceAccess()
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
  @ResourceAccess()
  @ResponseMessage('Successfully created user connection')
  @ApiOperation({ summary: 'Create a user connection' })
  async createConnection(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ) {
    return this.userService.createConnection(userId, recipientId);
  }

  @Delete(':userId/connections/:recipientId')
  @ResourceAccess()
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
  @ResponseMessage('Successfully retrieved all users matching your criteria')
  @ApiOperation({ summary: 'Get all users matching search criteria' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of users',
  })
  async findAll(@Query() query: GetUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Successfully found user')
  @ApiOperation({ summary: 'Find a specific user given their id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a user record',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @ResponseMessage('Successfully updated user')
  @ApiOperation({ summary: 'Update a specific user given their id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user record',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }
}
