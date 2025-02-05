import { Controller, Get, Param, Post } from '@nestjs/common';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Post()
    create(): Promise<Report> {
        return this.reportService.create();
    }

    @Get()
    findAll(): Promise<Report[]> {
        return this.reportService.findAll();
    }

    @Get(':id')
    findOneBy(@Param('id') id: number): Promise<Report | null> {
        return this.reportService.findOne(id);
    }
}
