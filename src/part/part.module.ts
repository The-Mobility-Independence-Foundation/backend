import { Module } from '@nestjs/common';
import { PartService } from './part.service';
import { PartController } from './part.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Part, PartType } from './part.entity';
import { Tag } from '../tag/tag.entity';
import { Model } from '../model/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Part, PartType, Tag, Model])],
  providers: [PartService],
  exports: [PartService],
  controllers: [PartController],
})
export class PartModule {}
