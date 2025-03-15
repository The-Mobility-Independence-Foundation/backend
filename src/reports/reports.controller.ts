import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  /**
   * Gets all reports that fit the search criteria.
   * @returns
   */
  @Get()
  @ApiOperation({ summary: 'Get all reports that fit search criteria.' })
  findAll(@Query() query: GetReportsDto): Promise<Report[]> {
    return this.reportService.findAll(query);
  }

  /**
   * Creates a new report.
   * @returns
   */
  @Post()
  @ApiOperation({ summary: 'Create a new report.' })
  create(@Body() dto: CreateReportDto): Promise<Report | BadRequestException> {
    return this.reportService.create(dto);
  }

  /**
   * Get a specific report based on its id.
   * @param id primary key for the reports table
   * @returns
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a report based on its id.' })
  findOneBy(@Param('id') id: number): Promise<Report | null> {
    return this.reportService.findOne(id);
  }

  /**
   * Update a specific report based on its id.
   * @param id primary key for the reports table
   * @returns
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update the report with a given id.' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateReportDto,
  ): Promise<Report | null> {
    return this.reportService.update(id, dto);
  }
}
