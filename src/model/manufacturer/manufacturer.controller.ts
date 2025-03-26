import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';
import { Manufacturer } from '../model.entity';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { GetManufacturersDto } from './dto/get-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ManufacturerService } from './manufacturer.service';

@ApiTags('manufacturer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  @ApiOperation({ summary: 'Initate creation of a manufacturer' })
  create(@Body() dto: CreateManufacturerDto): Promise<Manufacturer> {
    return this.manufacturerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all manufacturers' })
  findAll(
    @Query() query: GetManufacturersDto,
  ): Promise<BaseApiCursorPaginationResponse<Manufacturer>> {
    return this.manufacturerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific manufacturer' })
  findOne(@Param('id') id: number): Promise<Manufacturer | null> {
    return this.manufacturerService.findByIdOrThrow(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update information about a manufacturer' })
  update(@Param('id') id: number, @Body() dto: UpdateManufacturerDto) {
    return this.manufacturerService.update(id, dto);
  }
}
