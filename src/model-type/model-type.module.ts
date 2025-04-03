import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { ModelType } from '../model/model.entity';
import { ModelTypeController } from './model-type.controller';
import { ModelTypeService } from './model-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModelType]), CommonModule],
  controllers: [ModelTypeController],
  providers: [ModelTypeService],
  exports: [ModelTypeService],
})
export class ModelTypeModule {}
