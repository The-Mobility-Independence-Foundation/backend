import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { Model } from './model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { ModelTypeModule } from '../model-type/model-type.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model]),
    CommonModule,
    ModelTypeModule,
    ManufacturerModule,
  ],
  providers: [ModelService],
  exports: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
