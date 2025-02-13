import { Controller, Get, Param, Post } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Audit } from './audit.entity';

@Controller('audit')
export class AuditController {
  constructor(private readonly commentService: AuditService) {}
  
  @Post()
  create(): Promise<Audit> {
    return this.commentService.create();
  }

  @Get()
  findAll(): Promise<Audit[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Audit | null> {
    return this.commentService.findOne(id);
  }
}
