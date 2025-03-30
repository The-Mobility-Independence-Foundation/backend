import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { Manufacturer, Model, ModelType } from './model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, ModelType, Manufacturer]),
    CommonModule,
  ],
  providers: [ModelService],
  exports: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
