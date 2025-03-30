import { Controller, Post, Get, Param, Body, Query, Patch } from '@nestjs/common';
import { ModelService } from './model.service';
import { Model } from './model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { GetModelsDto } from './dto/get-model.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { UpdateModelDto } from './dto/update-model.dto';

@ApiTags('models')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
@Controller('models')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @ApiOperation({ summary: 'Initate creation of a model' })
  @ResponseMessage('Successfully created a model')
  create(@Body() dto: CreateModelDto): Promise<Model> {
    return this.modelService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all models' })
  @ResponseMessage('Successfully retrieved all models')
  findAll(@Query() query: GetModelsDto): Promise<BaseApiCursorPaginationResponse<Model>> {
    return this.modelService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Successfully retrieve model')
  @ApiOperation({ summary: 'Retrieve a specific model' })
  findOne(@Param('id') id: number): Promise<Model | null> {
    return this.modelService.findByIdOrThrow(id);
  }

  @Patch(':id')
  @ResponseMessage('Successfully updated a model')
  @ApiOperation({ summary: 'Update information about a model' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  update(@Param('id') id: number, @Body() dto: UpdateModelDto) {
    return this.modelService.update(id, dto);
  }
}
