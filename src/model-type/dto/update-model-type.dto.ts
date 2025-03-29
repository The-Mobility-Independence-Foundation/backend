import { PickType } from '@nestjs/mapped-types';
import { CreateModelTypeDto } from './create-model-type.dto';

export class UpdateManufacturerDto extends PickType(CreateModelTypeDto, [
  'name',
] as const) {}
