import { Module } from '@nestjs/common';
import { PartService } from './part.service';
import { PartController } from './part.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Part } from './part.entity';
import { CommonModule } from '../common/common.module';
import { PartTypeModule } from '../part-type/part-type.module';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [TypeOrmModule.forFeature([Part]),
  CommonModule,
  PartTypeModule,
  ModelModule,
  ],
  providers: [PartService],
  exports: [PartService],
  controllers: [PartController],
})
export class PartModule {}
