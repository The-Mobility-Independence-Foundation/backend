import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  /**
   * Creates a new report.
   * @returns
   */
  @Post()
  @ApiOperation({ summary: 'Create a new report.' })
  create(): Promise<Report> {
    return this.reportService.create();
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
  update(@Param('id') id: number): Promise<Report | null> {
    return this.reportService.findOne(id);
  }
}
