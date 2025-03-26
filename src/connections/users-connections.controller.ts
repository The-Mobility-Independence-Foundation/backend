import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
} from '@nestjs/common';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { ConnectionsService } from './connections.service';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@ApiTags('users')
@Controller('users/:userId/connections')
@UseStrategy(ResourceAccessStrategyToken.USER)
export class UsersConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved user connections')
  @ApiOperation({ summary: 'Get user connections' })
  async getConnections(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: CursorPaginationDto,
  ) {
    return this.connectionsService.findAll(userId, paginationDto);
  }

  @Post(':recipientId')
  @ResponseMessage('Successfully created user connection')
  @ApiOperation({ summary: 'Create a user connection' })
  async createConnection(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ) {
    return this.connectionsService.create(userId, recipientId);
  }

  @Delete(':recipientId')
  @ResponseMessage('Successfully deleted user connection')
  @ApiOperation({ summary: 'Delete a user connection' })
  async deleteConnection(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ) {
    return this.connectionsService.delete(userId, recipientId);
  }
}
