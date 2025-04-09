import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { PartType } from '../part/part.entity';
import { PartTypeController } from './part-type.controller';
import { PartTypeService } from './part-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartType]), CommonModule],
  controllers: [PartTypeController],
  providers: [PartTypeService],
  exports: [PartTypeService],
})
export class PartTypeModule {}
