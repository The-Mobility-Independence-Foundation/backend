import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  Req,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { Request } from 'express';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/@me')
  @ResponseMessage('Successfully retrieved user')
  @ApiOperation({ summary: 'Get the current user' })
  @UseStrategy(ResourceAccessStrategyToken.ANY_USER)
  async getUser(@Req() req: Request): Promise<User> {
    const user = req.user as User;
    return this.userService.getUserInfo(user.id);
  }

  @Get('/')
  @ResponseMessage('Successfully retrieved all users matching your criteria')
  @ApiOperation({ summary: 'Get all users matching search criteria' })
  async findAll(@Query() query: GetUsersDto) {
    return this.userService.findAll(query);
  }

  @Get('/:userId')
  @ResponseMessage('Successfully found user')
  @ApiOperation({ summary: 'Find a specific user given their id' })
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findByIdOrThrow(userId, {
      relations: { organization: true },
    });
  }

  @Patch('/:userId')
  @ResponseMessage('Successfully updated user')
  @ApiOperation({ summary: 'Update a specific user given their id' })
  @UseStrategy(ResourceAccessStrategyToken.USER)
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(userId, dto);
  }
}
