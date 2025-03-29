import { Module } from '@nestjs/common';
import { PartTypeController } from './part-type.controller';
import { PartTypeService } from './part-type.service';

@Module({
  controllers: [PartTypeController],
  providers: [PartTypeService]
})
export class PartTypeModule {}
