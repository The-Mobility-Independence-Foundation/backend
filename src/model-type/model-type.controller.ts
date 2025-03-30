import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { ModelTypeService } from './model-type.service';
import { ModelType } from '../model/model.entity';
import { CreateModelTypeDto } from './dto/create-model-type.dto';
import { GetModelTypesDto } from './dto/get-model-type.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { UpdateModelTypeDto } from './dto/update-model-type.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('model-types')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
@Controller('model-types')
export class ModelTypeController {
  constructor(private readonly modelTypeService: ModelTypeService) {}

  @Post()
  @ResponseMessage('Successfully created a model type')
  @ApiOperation({ summary: 'Initate creation of a model type' })
  create(@Body() dto: CreateModelTypeDto): Promise<ModelType> {
    return this.modelTypeService.create(dto);
  }

  @Get()
  @ResponseMessage('Successfully retreived all model types')
  @ApiOperation({ summary: 'Retrieve a list of all model types' })
  findAll(
    @Query() query: GetModelTypesDto,
  ): Promise<BaseApiCursorPaginationResponse<ModelType>> {
    return this.modelTypeService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Successfully retrieved a model type')
  @ApiOperation({ summary: 'Retrieve a specific model type' })
  findOne(@Param('id') id: number): Promise<ModelType> {
    return this.modelTypeService.findByIdOrThrow(id);
  }

  @Patch(':id')
  @ResponseMessage('Successfully updated a model type')
  @ApiOperation({ summary: 'Update information about a model type' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  update(@Param('id') id: number, @Body() dto: UpdateModelTypeDto) {
    return this.modelTypeService.update(id, dto);
  }
}
