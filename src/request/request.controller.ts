import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { CreateRequestDto } from './dto/create-request.dto';
import { GetRequestsDto } from './dto/get-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';

@ApiTags('requests')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('/')
  @ResponseMessage('Successfully created a request')
  @ApiOperation({ summary: 'Create a new request' })
  create(@Body() dto: CreateRequestDto): Promise<Request> {
    return this.requestService.create(dto);
  }

  @Get('/')
  @ResponseMessage('Successfully retrieved all requests')
  @ApiOperation({ summary: 'Retrieve all requests' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  findAll(
    @Query() query: GetRequestsDto,
  ): Promise<BaseApiCursorPaginationResponse<Request>> {
    return this.requestService.findAll(query);
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved a request')
  @ApiOperation({ summary: 'Retrieve a specific request' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  findOne(@Param('id') id: number): Promise<Request | null> {
    return this.requestService.findByIdOrThrow(id);
  }

  @Patch(':id')
  @ResponseMessage('Successfully updated a request')
  @ApiOperation({ summary: 'Update information about a request' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  update(@Param('id') id: number, @Body() dto: UpdateRequestDto) {
    return this.requestService.update(id, dto);
  }
}
