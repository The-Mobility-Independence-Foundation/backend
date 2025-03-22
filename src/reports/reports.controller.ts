import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  /**
   * Gets all reports that fit the search criteria.
   * @returns
   */
  @Get()
  @ApiOperation({ summary: 'Get all reports that fit search criteria.' })
  @ResponseMessage('Successfully found reports')
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of reports',
  })
  findAll(@Query() query: GetReportsDto) {
    return this.reportService.findAll(query);
  }

  /**
   * Creates a new report.
   * @returns
   */
  @Post()
  @ApiOperation({ summary: 'Create a new report.' })
  @ResponseMessage('Successfully created report')
  @ApiResponse({
    status: 200,
    description: 'Returns the newly created report record',
  })
  create(@Body() dto: CreateReportDto) {
    return this.reportService.create(dto);
  }

  /**
   * Get a specific report based on its id.
   * @param id primary key for the reports table
   * @returns
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a report based on its id.' })
  @ResponseMessage('Successfully found report')
  @ApiResponse({
    status: 200,
    description: 'Returns the report record',
  })
  findOneBy(@Param('id') id: number) {
    return this.reportService.findByIdOrThrow(id);
  }

  /**
   * Update a specific report based on its id.
   * @param id primary key for the reports table
   * @returns
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update the report with a given id.' })
  @ResponseMessage('Successfully updated report')
  @ApiResponse({
    status: 200,
    description: 'Returns updated report record',
  })
  update(@Param('id') id: number, @Body() dto: UpdateReportDto) {
    return this.reportService.update(id, dto);
  }
}
