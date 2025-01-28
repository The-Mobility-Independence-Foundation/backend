import { Module } from '@nestjs/common';
import { WordfilterController } from './wordfilter.controller';
import { WordfilterService } from './wordfilter.service';

@Module({
  controllers: [WordfilterController],
  providers: [WordfilterService]
})
export class WordfilterModule {}
