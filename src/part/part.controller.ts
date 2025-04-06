import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { PartService } from './part.service';
import { Part } from './part.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { GetPartsDto } from './dto/get-part.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { UpdatePartDto } from './dto/update-part.dto';

@ApiTags('parts')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
@Controller('parts')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  @ApiOperation({ summary: 'Initate creation of a part' })
  @ResponseMessage('Successfully created a part')
  create(@Body() dto: CreatePartDto): Promise<Part> {
    return this.partService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all parts' })
  @ResponseMessage('Successfully retrieved all parts')
  findAll(
    @Query() query: GetPartsDto,
  ): Promise<BaseApiCursorPaginationResponse<Part>> {
    return this.partService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Successfully retrieve part')
  @ApiOperation({ summary: 'Retrieve a specific part' })
  findOne(@Param('id') id: number): Promise<Part | null> {
    return this.partService.findByIdOrThrow(id);
  }

  @Patch(':id')
  @ResponseMessage('Successfully updated a part')
  @ApiOperation({ summary: 'Update information about a part' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  update(@Param('id') id: number, @Body() dto: UpdatePartDto) {
    return this.partService.update(id, dto);
  }
}
