import { Module } from '@nestjs/common';
import { WordfilterController } from './wordfilter.controller';
import { WordfilterService } from './wordfilter.service';
import { Wordfilter } from './wordfilter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Wordfilter])],
  controllers: [WordfilterController],
  providers: [WordfilterService],
})
export class WordfilterModule {}
