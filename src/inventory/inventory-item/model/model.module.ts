import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { Model, ModelType } from './model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Model, ModelType])],
  providers: [ModelService],
  controllers: [ModelController]
})
export class ModelModule {}
