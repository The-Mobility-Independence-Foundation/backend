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
import { PartType } from '../part/part.entity';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { CreatePartTypeDto } from './dto/create-part-type.dto';
import { PartTypeService } from './part-type.service';
import { GetPartTypesDto } from './dto/get-part-type.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { UpdatePartTypeDto } from './dto/update-part-type.dto';

@ApiTags('part-types')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
@Controller('part-types')
export class PartTypeController {
  constructor(private readonly partTypeService: PartTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Initate creation of a part type' })
  create(@Body() dto: CreatePartTypeDto): Promise<PartType> {
    return this.partTypeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all part types' })
  findAll(
    @Query() query: GetPartTypesDto,
  ): Promise<BaseApiCursorPaginationResponse<PartType>> {
    return this.partTypeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific part type' })
  findOne(@Param('id') id: number): Promise<PartType> {
    return this.partTypeService.findByIdOrThrow(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update information about a part type' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  update(@Param('id') id: number, @Body() dto: UpdatePartTypeDto) {
    return this.partTypeService.update(id, dto);
  }
}
